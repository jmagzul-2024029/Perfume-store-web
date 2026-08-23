// Envío de correos vía la API HTTP de Brevo (https://api.brevo.com/v3/smtp/email).
// Se usa fetch directo (sin el SDK @getbrevo/brevo) para evitar problemas de
// versiones/exports del paquete. Además, se usa API HTTP en vez de SMTP a
// propósito: Render bloquea/limita conexiones SMTP salientes en su plan free,
// pero las peticiones HTTPS normales sí funcionan.

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendVerificationEmail = async (to, name, token) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY no está configurada en las variables de entorno');
  }

  const payload = {
    sender: {
      name: process.env.EMAIL_FROM_NAME || "L'ESSENCE DE FRANCE",
      email: process.env.EMAIL_FROM,
    },
    to: [{ email: to, name: name || undefined }],
    subject: "Verifica tu cuenta - L'ESSENCE DE FRANCE",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1a1a1a;">¡Bienvenido a L'ESSENCE DE FRANCE${name ? `, ${name}` : ''}!</h2>
        <p>Tu código de verificación para completar el registro es:</p>
        <div style="background-color: #f4f4f4; padding: 10px 20px; font-size: 24px; font-weight: bold; width: fit-content; letter-spacing: 4px; border-radius: 5px;">
          ${token}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">Si no solicitaste este código, ignora este mensaje.</p>
      </div>
    `,
  };

  try {
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

    console.log('Correo enviado con éxito (Brevo):', data.messageId || data);
    return data;
  } catch (error) {
    console.error('Error enviando correo con Brevo:', error.message);
    throw error;
  }
};
