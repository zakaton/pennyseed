import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

const adminEmail = 'contact@pennyseed.fund';
const notificationsEmail = 'notifications@pennyseed.fund';

export default async function sendEmail(...messages) {
  console.log(
    messages.map((message) => ({
      ...message,
      dynamicTemplateData: {
        email: message.to,
        subject: message.subject,
        ...message?.dynamicTemplateData,
      },
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      from: {
        email: notificationsEmail,
        name: 'Pennyseed',
      },
      replyTo: adminEmail,
    }))
  );
  try {
    await mail.send(
      messages.map((message) => ({
        ...message,
        dynamicTemplateData: {
          email: message.to,
          subject: message.subject,
          ...message?.dynamicTemplateData,
        },
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        from: {
          email: notificationsEmail,
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
  sendEmail({
    ...message,
    to: adminEmail,
  });
}
