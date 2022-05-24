/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService } from '../../../utils/supabase';
// import updateCampaignNumberOfPledgers from '../../../utils/update-campaign-number-of-pledgers';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(200).json({
      type: 'failed',
      title: 'Unauthorized',
      message: 'you are not signed in',
    });
  }
  const { paymentMethodId } = req.body;

  if (!paymentMethodId) {
    return res.status(200).json({
      type: 'failed',
      title: 'Missing Payment Method',
      message: 'you must specify a payment method to remove',
    });
  }

  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    const status =
      paymentMethod.customer == null
        ? { type: 'succeeded', title: 'Successfully Removed Card' }
        : { type: 'failed', title: 'Failed to Remove Card' };
    res.status(200).json({ status });
  } catch (error) {
    const status = {
      type: 'failed',
      title: 'Failed to Remove Card',
      message: error.message,
    };
    res.status(200).json({ status });
  }
}
