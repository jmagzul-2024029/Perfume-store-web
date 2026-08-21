import nodemailer from 'nodemailer';
import { config } from '../configs/config.js';

// Configurar el transportador de email (aligned with .NET SmtpSettings)
const createTransporter = () => {
  if (!config.smtp.username || !config.smtp.password) {
    console.warn(
      'SMTP credentials not configured. Email functionality will not work.'
    );
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.enableSsl, // true para 465, false para 587
    auth: {
      user: config.smtp.username,
      pass: config.smtp.password,
    },
    // Evitar que las peticiones HTTP queden colgadas si SMTP no responde
    connectionTimeout: 10_000, // 10s
    greetingTimeout: 10_000, // 10s
    socketTimeout: 10_000, // 10s
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const transporter = createTransporter();

/**
 * Verifica la conexión SMTP al arrancar el servidor.
 * Antes, si las credenciales eran inválidas o Gmail rechazaba la conexión,
 * el error solo se veía cuando alguien intentaba registrarse (y quedaba
 * "silenciado" dentro de un catch en background). Con esto se ve de una
 * vez en consola al iniciar `npm run dev` / `npm start`.
 */
export const verifyEmailTransporter = async () => {
  if (!transporter) {
    console.warn(
      '⚠️  SMTP no configurado (revisa SMTP_USERNAME/SMTP_PASSWORD en .env). Los correos de verificación NO se enviarán.'
    );
    return false;
  }

  try {
    await transporter.verify();
    console.log(`✅ SMTP conectado correctamente (${config.smtp.username})`);
    return true;
  } catch (error) {
    console.error(
      '❌ No se pudo conectar al servidor SMTP. Los correos de verificación NO se enviarán.'
    );
    console.error(`   Motivo: ${error.message}`);
    if (error.responseCode === 535 || /invalid login|username and password/i.test(error.message || '')) {
      console.error(
        '   → Esto normalmente significa que la contraseña de aplicación de Gmail es incorrecta, expiró o fue revocada.'
      );
      console.error(
        '   → Genera una nueva en https://myaccount.google.com/apppasswords y actualiza SMTP_PASSWORD en el .env.'
      );
    }
    return false;
  }
};

export const sendVerificationEmail = async (email, name, verificationToken) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `${config.smtp.fromName || "L'ESSENCE DE FRANCE"} <${config.smtp.fromEmail}>`,
      to: email,
      subject: "Verifica tu cuenta de L'ESSENCE DE FRANCE",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #b76e79; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">L'ESSENCE DE FRANCE</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #111827; margin-top: 0;">¡Hola ${name}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Gracias por registrarte. Por favor verifica tu cuenta haciendo clic en el siguiente botón: (Uso único)</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href='${verificationUrl}' style='background-color: #b76e79; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>
                  Verificar mi cuenta
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p style="color: #b76e79; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Este enlace expira en 24 horas.</p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">Si no solicitaste esta cuenta, ignora este correo.</p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">Si ha pasado mucho y no pudiste validar tu cuenta, y tampoco te deja ingresar al sistema, comunícate con el administrador.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `${config.smtp.fromName || "L'ESSENCE DE FRANCE"} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #b76e79; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">L'ESSENCE DE FRANCE</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #111827; margin-top: 0;">Hola ${name},</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón para crear una nueva:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href='${resetUrl}' style='background-color: #b76e79; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>
                  Restablecer Contraseña
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">O copia este enlace en tu navegador:</p>
            <p style="color: #b76e79; font-size: 14px; word-break: break-all;">${resetUrl}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Este enlace expira en 1 hora.</p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">Si no solicitaste este cambio, ignora este correo y tu cuenta seguirá segura.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const mailOptions = {
      from: `${config.smtp.fromName || "L'ESSENCE DE FRANCE"} <${config.smtp.fromEmail}>`,
      to: email,
      subject: "¡Bienvenido a L'ESSENCE DE FRANCE!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #b76e79; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">L'ESSENCE DE FRANCE</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #111827; margin-top: 0;">¡Hola ${name}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Tu cuenta ha sido verificada y activada exitosamente.</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Ya puedes acceder a nuestra plataforma y comenzar a disfrutar de nuestros servicios.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Si tienes alguna pregunta, no dudes en contactar a soporte.</p>
            <p style="color: #111827; font-weight: bold; margin-top: 20px;">¡Gracias por unirte!</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendPasswordChangedEmail = async (email, name) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const mailOptions = {
      from: `${config.smtp.fromName || "L'ESSENCE DE FRANCE"} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Tu contraseña ha sido actualizada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #10b981; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">L'ESSENCE DE FRANCE</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #111827; margin-top: 0;">Contraseña Actualizada</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hola ${name},</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Te informamos que tu contraseña ha sido cambiada exitosamente.</p>
            <p style="color: #ef4444; font-size: 14px; margin-top: 30px;">Si tú no realizaste este cambio, por favor contacta a soporte inmediatamente.</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password changed email:', error);
    throw error;
  }
};

/**
 * Función genérica para enviar correos con HTML personalizado (Facturas, Reportes)
 */
export const sendHtmlEmail = async (email, subject, html) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const mailOptions = {
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending HTML email:', error);
    throw error;
  }
};
