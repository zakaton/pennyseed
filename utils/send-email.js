import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

const adminEmail = 'contact@pennyseed.fund';
const updatesEmail = 'updates@pennyseed.fund';

export default async function sendEmail(...messages) {
  try {
    await mail.send(
      messages.map((message) => ({
        ...message,
        from: {
          email: updatesEmail,
          name: 'Pennyseed',
        },
        replyTo: adminEmail,
      }))
    );
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

export async function emailAdmin(message) {
  sendEmail({ ...message, to: adminEmail });
}
