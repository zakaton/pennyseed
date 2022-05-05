import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from './supabase';

const supabase = getSupabaseService();

export default async function createStripeIntent({ req }) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (user) {
    return null;
  }

  const profile = await getUserProfile(user, supabase);

  const setupIntent = await stripe.setupIntents.create({
    customer: profile.customer_id,
  });

  return setupIntent;
}
