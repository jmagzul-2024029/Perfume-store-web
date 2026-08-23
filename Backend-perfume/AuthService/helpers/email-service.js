import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to, token) => {
  try {
    const data = await resend.emails.send({
      from: "L'ESSENCE DE FRANCE <onboarding@resend.dev>",
      to: [to],
      subject: "Verifica tu cuenta - L'ESSENCE DE FRANCE",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1a1a1a;">¡Bienvenido a L'ESSENCE DE FRANCE!</h2>
          <p>Tu código de verificación para completar el registro es:</p>
          <div style="background-color: #f4f4f4; padding: 10px 20px; font-size: 24px; font-weight: bold; width: fit-content; letter-spacing: 4px; border-radius: 5px;">
            ${token}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">Si no solicitaste este código, ignora este mensaje.</p>
        </div>
      `
    });
    console.log('Correo enviado con éxito:', data);
    return data;
  } catch (error) {
    console.error('Error enviando correo con Resend:', error);
    throw error;
  }
};