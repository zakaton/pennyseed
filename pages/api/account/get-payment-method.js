/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';
import stripPaymentMethod from '../../../utils/strip-payment-method';

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const sendError = (error) =>
    res.status(200).json({
      status: {
        type: 'failed',
        title: 'Failed to get Payment Method',
        ...error,
      },
    });

  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return sendError({ message: 'You are not signed in' });
  }

  const { paymentMethodId } = req.query;
  if (!paymentMethodId) {
    return sendError({ message: 'paymentMethodId required' });
  }

  const profile = await getUserProfile(user, supabase);
  if (!profile) {
    return sendError({ message: 'profile not found' });
  }
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (!paymentMethod) {
    return sendError({ message: 'payment method not found' });
  }
  if (paymentMethod.customer !== profile.stripe_customer) {
    return sendError({ message: 'payment method is not yours' });
  }
  res.status(200).json({
    status: { type: 'succeeded', message: 'Successfully got Payment Method' },
    paymentMethod: stripPaymentMethod(paymentMethod),
  });
}
