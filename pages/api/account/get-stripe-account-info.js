/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService(req);
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const profile = await getUserProfile(user, supabase);
  const account = await stripe.accounts.retrieve(profile.stripe_account);
  if (account) {
    res.status(200).json({
      canCreateCampaigns: account.charges_enabled,
      hasCompletedOnboarding: account.details_submitted,
    });
  } else {
    res.status(400).send('could not find stripe account for user');
  }
}
