/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService } from '../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService(req);
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  if (!req.body.paymentMethodId) {
    return res.status(400).send("requires a 'paymentMethodId' form field");
  }

  stripe.paymentMethods.detach(req.body.paymentMethodId);
  res.redirect('/account#payment-info');
}
