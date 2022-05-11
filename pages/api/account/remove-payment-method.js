/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService } from '../../../utils/supabase';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const supabase = getSupabaseService(req);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  if (!req.body.paymentMethodId) {
    return res.status(400).send("requires a 'paymentMethodId' form field");
  }

  const paymentMethod = await stripe.paymentMethods.detach(
    req.body.paymentMethodId
  );

  const status = paymentMethod.customer == null ? 'succeeded' : 'failed';
  res.status(200).json({ status });
}
