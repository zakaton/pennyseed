import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

console.log(process.env.SENDGRID_API_KEY);

const adminEmail = 'contact@pennyseed.fund';

export default async function sendEmail(message) {
  return mail.send({
    ...message,
    from: {
      email: 'updates@pennyseed.fund',
      name: 'Pennyseed',
    },
    replyTo: adminEmail,
  });
}

export async function emailAdmin(message) {
  return sendEmail({ ...message, to: adminEmail });
}
