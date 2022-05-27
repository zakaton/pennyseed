import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

const adminEmail = 'contact@pennyseed.fund';
const updatesEmail = 'updates@pennyseed.fund';

export default async function sendEmail(...messages) {
  return mail.send(
    messages.map((message) => ({
      ...message,
      from: {
        email: updatesEmail,
        name: 'Pennyseed',
      },
      replyTo: adminEmail,
    }))
  );
}

export async function emailAdmin(message) {
  return sendEmail({ ...message, to: adminEmail });
}
