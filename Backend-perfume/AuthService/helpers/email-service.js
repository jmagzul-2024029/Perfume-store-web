import { config } from '../configs/config.js';

// Envío de correos vía la API HTTP de Brevo (https://api.brevo.com/v3/smtp/email).
// Se usa fetch directo (sin el SDK @getbrevo/brevo) para evitar problemas de
// versiones/exports del paquete. Además, se usa API HTTP en vez de SMTP a
// propósito: Render bloquea/limita conexiones SMTP salientes en su plan free,
// pero las peticiones HTTPS normales sí funcionan.

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BRAND_NAME = "L'ESSENCE DE FRANCE";

const wrapper = (innerHtml, headerColor = '#4f46e5') => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
    <div style="background-color: ${headerColor}; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">${BRAND_NAME}</h1>
    </div>
    <div style="padding: 30px; background-color: #ffffff;">
      ${innerHtml}
    </div>
  </div>
`;

const sendViaBrevo = async ({ to, name, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY no está configurada en las variables de entorno');
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error('EMAIL_FROM no está configurada en las variables de entorno');
  }

  const payload = {
    sender: {
      name: process.env.EMAIL_FROM_NAME || BRAND_NAME,
      email: process.env.EMAIL_FROM,
    },
    to: [{ email: to, name: name || undefined }],
    subject,
    htmlContent: html,
  };

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Brevo respondió ${response.status}: ${data.message || JSON.stringify(data)}`
    );
  }

  return data;
};

export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const html = wrapper(`
      <h2 style="color: #111827; margin-top: 0;">¡Hola ${name}!</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Gracias por registrarte. Por favor verifica tu cuenta haciendo clic en el siguiente botón:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Verificar mi cuenta
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
      <p style="color: #4f46e5; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">Este enlace expira en 24 horas.</p>
      <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">Si no solicitaste esta cuenta, ignora este correo.</p>
    `);

    return await sendViaBrevo({
      to: email,
      name,
      subject: `Verifica tu cuenta de ${BRAND_NAME}`,
      html,
    });
  } catch (error) {
    console.error('Error sending verification email:', error.message);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const html = wrapper(`
      <h2 style="color: #111827; margin-top: 0;">Hola ${name},</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón para crear una nueva:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Restablecer contraseña
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">O copia este enlace en tu navegador:</p>
      <p style="color: #4f46e5; font-size: 14px; word-break: break-all;">${resetUrl}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">Este enlace expira en 1 hora.</p>
      <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">Si no solicitaste este cambio, ignora este correo y tu cuenta seguirá segura.</p>
    `);

    return await sendViaBrevo({
      to: email,
      name,
      subject: 'Recuperación de contraseña',
      html,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const html = wrapper(`
      <h2 style="color: #111827; margin-top: 0;">¡Hola ${name}!</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Tu cuenta ha sido verificada y activada exitosamente.</p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Ya puedes acceder a nuestra tienda y comenzar a disfrutar de nuestros perfumes.</p>
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
      <p style="color: #111827; font-weight: bold; margin-top: 20px;">¡Gracias por unirte!</p>
    `);

    return await sendViaBrevo({
      to: email,
      name,
      subject: `¡Bienvenido a ${BRAND_NAME}!`,
      html,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error.message);
    throw error;
  }
};

export const sendPasswordChangedEmail = async (email, name) => {
  try {
    const html = wrapper(`
      <h2 style="color: #111827; margin-top: 0;">Contraseña actualizada</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hola ${name},</p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Te informamos que tu contraseña ha sido cambiada exitosamente.</p>
      <p style="color: #ef4444; font-size: 14px; margin-top: 30px;">Si tú no realizaste este cambio, por favor contáctanos inmediatamente.</p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
    `, '#10b981');

    return await sendViaBrevo({
      to: email,
      name,
      subject: 'Tu contraseña ha sido actualizada',
      html,
    });
  } catch (error) {
    console.error('Error sending password changed email:', error.message);
    throw error;
  }
};

/**
 * Función genérica para enviar correos con HTML personalizado.
 */
export const sendHtmlEmail = async (email, subject, html) => {
  try {
    return await sendViaBrevo({ to: email, subject, html });
  } catch (error) {
    console.error('Error sending HTML email:', error.message);
    throw error;
  }
};
