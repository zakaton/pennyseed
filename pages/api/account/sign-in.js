/* eslint-disable consistent-return */
import { getSupabaseService } from '../../../utils/supabase';

import sendEmail from '../../../utils/send-email';

const magicLinkEmail = 'magic-link@pennyseed.fund';
const recoveryEmailLimit = 1000 * 60; // ms

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
    return sendError({ message: 'must send a "POST" message' });
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
    return sendError({
      message: `invalid redirectTo url "${redirectTo}"`,
    });
  }
  console.log(email, redirectTo);

  const supabase = getSupabaseService();
  const { data: profile, error: getProfileError } = await supabase
    .from('profile')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (getProfileError) {
    console.error(getProfileError);
    return sendError({ message: getProfileError.message });
  }

  console.log('profile', profile);

  if (profile) {
    const { data: user, error: getUserError } =
      await supabase.auth.api.getUserById(profile.id);
    if (getUserError) {
      console.error(getUserError);
      return sendError({ message: getUserError.message });
    }
    console.log('user', user);
    const currentDate = new Date();
    const lastTime = new Date(user.recovery_sent_at);
    const timeSinceLastRecovery = currentDate.getTime() - lastTime.getTime();
    console.log('timeSinceLastRecovery', timeSinceLastRecovery);
    if (timeSinceLastRecovery < recoveryEmailLimit) {
      return sendError({
        title: 'Magic Link already sent',
        message:
          "A link was already emailed to this address less than a minute ago. Check your spam folder if you can't find it.",
      });
    }
  }

  const { data, generateLinkError } = await supabase.auth.api.generateLink(
    'magiclink',
    email,
    {
      redirectTo,
    }
  );
  if (generateLinkError) {
    console.error(generateLinkError);
    return sendError({ message: generateLinkError.message });
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
