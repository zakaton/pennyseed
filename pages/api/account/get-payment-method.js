/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';
import stripPaymentMethod from '../../../utils/strip-payment-method';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const sendErrorMessage = (errorMessage) =>
    res.status(200).json({
      error: errorMessage,
    });

  const { paymentMethodId } = req.query;
  if (!paymentMethodId) {
    return sendErrorMessage('paymentMethodId required');
  }

  const profile = await getUserProfile(user, supabase);
  if (!profile) {
    return sendErrorMessage('profile not found');
  }
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (!paymentMethod) {
    return sendErrorMessage('payment method not found');
  }
  if (paymentMethod.customer !== profile.stripe_customer) {
    return sendErrorMessage('payment method is not yours');
  }
  res.status(200).json({
    paymentMethod: stripPaymentMethod(paymentMethod),
  });
}
