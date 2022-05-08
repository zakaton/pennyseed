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
  const paymentMethods = await stripe.paymentMethods.list({
    customer: profile.stripe_customer,
    type: 'card',
  });
  res.status(200).json({
    stripePaymentMethods: paymentMethods.data.map(
      ({ id, card: { brand, last4 } }) => ({
        card: { brand, last4 },
        id,
      })
    ),
  });
}
