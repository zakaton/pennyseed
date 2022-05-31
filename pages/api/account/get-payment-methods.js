/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';
import { numberOfPaymentMethodsPerPage } from '../../../utils/get-payment-methods';
import stripPaymentMethod from '../../../utils/strip-payment-method';

export default async function handler(req, res) {
  console.log('cookies', req.cookies);
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const sendError = (error) =>
    res.status(200).json({
      status: {
        type: 'failed',
        title: 'Failed to get Payment Methods',
        ...error,
      },
    });

  const supabase = getSupabaseService();
  console.log(req.cookies);
  const { user, error } = await supabase.auth.api.getUserByCookie(req, res);
  console.log(error);
  if (!user) {
    return sendError({ message: 'You are not signed in' });
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
    status: { type: 'succeeded', title: 'Successfully got Payment Methods' },
    paymentMethods: paymentMethods.data.map((paymentMethod) =>
      stripPaymentMethod(paymentMethod)
    ),
  });
}
