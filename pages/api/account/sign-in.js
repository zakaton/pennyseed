/* eslint-disable consistent-return */
import { getSupabaseService } from '../../../utils/supabase';

import sendEmail from '../../../utils/send-email';

const magicLinkEmail = 'magic-link@pennyseed.fund';

export default async function handler(req, res) {
  const allowedDomains = process.env.MAGIC_LINK_REDIRECT_URLS.split(',');

  const sendError = (error) =>
    res.status(200).json({
      status: {
        type: 'failed',
        title: 'Failed to send Magic Link',
        ...error,
      },
    });
  if (req.method !== 'POST') {
    return sendEmail({ message: 'must send a "POST" message' });
  }

  console.log(JSON.stringify(req.body));
  const { email, redirectTo } = req.body;
  if (!email) {
    return sendError({ message: 'no email defined' });
  }
  if (
    redirectTo &&
    !allowedDomains.some((allowedDomain) =>
      redirectTo.startsWith(allowedDomain)
    )
  ) {
    return sendError({ message: `invalid redirectTo url "${redirectTo}", ${JSON.stringify(allowedDomains)}` });
  }
  console.log(email, redirectTo);

  const supabase = getSupabaseService();
  const { data, error } = await supabase.auth.api.generateLink(
    'magiclink',
    email,
    {
      redirectTo,
    }
  );
  if (error) {
    console.error(error);
    return sendError({ message: error.message });
  }

  await sendEmail({
    to: email,
    subject: 'Sign in to Pennyseed',
    from: {
      email: magicLinkEmail,
    },
    templateId: process.env.SENDGRID_MAGIC_LINK_TEMPLATE_ID,
    dynamicTemplateData: {
      heading: 'Your Pennyseed Magic Link',
      body: 'Follow this link to sign in to Pennyseed:',
      optional_link: 'Sign In',
      optional_link_url: data.action_link,
    },
  });

  res.status(200).json({
    status: {
      type: 'succeeded',
      title: 'Successfully sent Magic Link',
    },
  });
}
