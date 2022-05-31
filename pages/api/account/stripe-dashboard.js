/* eslint-disable consistent-return */
import Stripe from 'stripe';
import absoluteUrl from 'next-absolute-url';
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const supabase = getSupabaseService(req);
  const { user } = await supabase.auth.api.getUserByCookie(req, res);
  if (!user) {
    return res.redirect('/account');
  }

  const { origin } = absoluteUrl(req);

  const profile = await getUserProfile(user, supabase);
  const link = await stripe.accounts.createLoginLink(profile.stripe_account, {
    redirect_url: origin + process.env.STRIPE_ACCOUNT_LOGIN_LINK_REDIRECT_URL,
  });
  if (link) {
    res.redirect(link.url);
  } else {
    res.redirect('/account');
  }
}
