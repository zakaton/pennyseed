/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';
import { numberOfPaymentMethodsPerPage } from '../../../utils/get-payment-methods';
import stripPaymentMethod from '../../../utils/strip-payment-method';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res
      .status(200)
      .json({ status: { type: 'failed', title: 'You are not signed in' } });
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
    limit: numberOfPaymentMethodsPerPage,
    ...options,
  });
  res.status(200).json({
    status: { type: 'succeeded' },
    paymentMethods: paymentMethods.data.map((paymentMethod) =>
      stripPaymentMethod(paymentMethod)
    ),
  });
}
