import * as Brevo from '@getbrevo/brevo';

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendVerificationEmail = async (to, token) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Verifica tu cuenta - L'ESSENCE DE FRANCE";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #1a1a1a;">¡Bienvenido a L'ESSENCE DE FRANCE!</h2>
      <p>Tu código de verificación para completar el registro es:</p>
      <div style="background-color: #f4f4f4; padding: 10px 20px; font-size: 24px; font-weight: bold; width: fit-content; letter-spacing: 4px; border-radius: 5px;">
        ${token}
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #777;">Si no solicitaste este código, ignora este mensaje.</p>
    </div>
  `;
  sendSmtpEmail.sender = {
    name: process.env.EMAIL_FROM_NAME || "L'ESSENCE DE FRANCE",
    email: process.env.EMAIL_FROM
  };
  sendSmtpEmail.to = [{ email: to }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Correo enviado con éxito vía Brevo API:', data);
    return data;
  } catch (error) {
    console.error('Error enviando correo con Brevo:', error);
    throw error;
  }
};