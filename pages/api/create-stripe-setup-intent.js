import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../utils/supabase';
import enforceApiRouteSecret from '../../utils/enforce-api-route-secret';

const supabase = getSupabaseService();

// eslint-disable-next-line consistent-return
export default async function handler(req, res) {
  if (!enforceApiRouteSecret(req, res)) {
    return;
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  const profile = await getUserProfile(user, supabase);

  const setupIntent = await stripe.setupIntents.create({
    customer: profile.customer_id,
  });
  res.status(200).json({ client_secret: setupIntent.client_secret });
}
