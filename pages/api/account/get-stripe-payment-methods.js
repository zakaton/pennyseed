/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';
import { numberOfPaymentMethodsPerPage } from '../../../utils/get-stripe-payment-methods';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const { endingBefore, startingAfter } = req.query;
  const options = {};
  if (endingBefore) {
    options.ending_before = endingBefore;
  } else if (startingAfter) {
    options.starting_after = startingAfter;
  }

  const profile = await getUserProfile(user, supabase);
  const paymentMethods = await stripe.paymentMethods.list({
    customer: profile.stripe_customer,
    type: 'card',
    limit: numberOfPaymentMethodsPerPage + 1,
    ...options,
  });
  res.status(200).json({
    stripePaymentMethods: paymentMethods.data.map(
      ({ id, card: { brand, last4, exp_month, exp_year } }) => ({
        card: { brand, last4, exp_month, exp_year },
        id,
      })
    ),
  });
}
