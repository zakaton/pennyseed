/* eslint-disable consistent-return */
import Stripe from 'stripe';
import {
  getSupabaseService,
  getUserByAccessToken,
} from '../../../utils/supabase';

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const sendError = (error = {}) =>
    res.status(200).json({
      status: {
        type: 'failed',
        title: 'Failed to Remove Payment Method',
        ...error,
      },
    });

  const supabase = getSupabaseService();
  const { user } = await getUserByAccessToken(supabase, req);
  if (!user) {
    return sendError({ message: 'you are not signed in' });
  }

  const { paymentMethodId } = req.body;
  if (!paymentMethodId) {
    return sendError({ message: 'Missing Payment Method' });
  }

  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    console.log(paymentMethod);
    console.log(paymentMethod.customer);
    if (paymentMethod.customer !== null) {
      return sendError();
    }

    res.status(200).json({
      status: { type: 'succeeded', title: 'Successfully Removed Card' },
    });
  } catch (error) {
    return sendError({ message: error.message });
  }
}
