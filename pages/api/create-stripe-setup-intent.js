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
  console.log(profile.stripe_customer);
  const setupIntent = await stripe.setupIntents.create({
    customer: profile.stripe_customer,
  });
  res.status(200).json({ client_secret: setupIntent.client_secret });
}
