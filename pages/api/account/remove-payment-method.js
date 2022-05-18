/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService } from '../../../utils/supabase';
import updateCampaignNumberOfPledgers from '../../../utils/update-campaign-number-of-pledgers';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  const { paymentMethodId } = req.body;

  if (!paymentMethodId) {
    return res.status(400).send("requires a 'paymentMethodId' form field");
  }

  console.log('payment method', paymentMethodId);
  const { data: pledges, error: deletePledgesError } = await supabase
    .from('pledge')
    .delete()
    .eq('payment_method', paymentMethodId);
  console.log('delete pledges result', deletePledgesError, pledges);

  await pledges.forEach(async (pledge) => {
    updateCampaignNumberOfPledgers(pledge.campaign, supabase);
  });

  const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

  const status = paymentMethod.customer == null ? 'succeeded' : 'failed';
  res.status(200).json({ status });
}
