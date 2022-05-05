/* eslint-disable consistent-return */
import Stripe from 'stripe';
import cookie from 'cookie';
import { getSupabaseService, getUserProfile } from '../../utils/supabase';

const supabase = getSupabaseService();

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const token = cookie.parse(req.headers.cookie)['sb-access-token'];
  supabase.auth.session = () => ({
    access_token: token,
  });
  const profile = await getUserProfile(user, supabase);

  const setupIntent = await stripe.setupIntents.create({
    customer: profile.customer_id,
  });
  res.status(200).json({ client_secret: setupIntent.client_secret });
}
