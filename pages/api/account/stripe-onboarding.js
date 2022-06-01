/* eslint-disable consistent-return */
import Stripe from 'stripe';
import absoluteUrl from 'next-absolute-url';
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = getSupabaseService(req);
  const { user } = await supabase.auth.api.getUserByCookie(req, res);
  if (!user) {
    return res.redirect('/account');
  }

  const { origin } = absoluteUrl(req);

  const profile = await getUserProfile(user, supabase);
  const link = await stripe.accountLinks.create({
    account: profile.stripe_account,
    refresh_url:
      origin + process.env.STRIPE_ACCOUNT_ONBOARDING_LINK_REFRESH_URL,
    return_url: origin + process.env.STRIPE_ACCOUNT_ONBOARDING_LINK_RETURN_URL,
    type: 'account_onboarding',
  });
  if (link) {
    res.redirect(link.url);
  } else {
    res.redirect('/account');
  }
}
