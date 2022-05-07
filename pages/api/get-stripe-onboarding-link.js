/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService(req);
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const profile = await getUserProfile(user, supabase);
  const link = await stripe.accountLinks.create({
    account: profile.stripe_account,
    refresh_url: 'http://localhost:3000/account',
    return_url: 'http://localhost:3000/account',
    type: 'account_onboarding',
  });
  if (link) {
    res.status(200).json({
      stripe_onboarding_link: link.url,
    });
  } else {
    res.status(400).send('could not find stripe account for user');
  }
}
