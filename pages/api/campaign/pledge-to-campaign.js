/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const { campaignId, paymentMethodId } = req.body;
  const { data: campaign } = await supabase
    .from('campaign')
    .select('*')
    .match({ id: campaignId })
    .single();

  if (campaign) {
    const profile = await getUserProfile(user, supabase);

    let errorMessage;

    if (profile.id === campaign.created_by) {
      errorMessage = 'you cannot pledge to your own campaign';
    } else {
      const { data: existingPledge } = await supabase
        .from('pledge')
        .select('*')
        .eq('pledger', profile.id)
        .maybeSingle();
      if (existingPledge) {
        errorMessage = "you've already pledged to this campaign";
      } else {
        const paymentMethod = await stripe.paymentMethods.retrieve(
          paymentMethodId
        );
        if (!paymentMethod) {
          errorMessage = 'payment method does not exist';
        } else if (paymentMethod.customer !== profile.stripe_customer) {
          errorMessage = 'payment method is not yours';
        } else {
          const { data: pledge, error } = await supabase.from('pledge').insert([
            {
              pledger: profile.id,
              payment_method: paymentMethodId,
              campaign: campaignId,
            },
          ]);
          console.log('create pledge result', pledge, error);
        }
      }
    }

    if (errorMessage) {
      return res.status(200).json({
        error: errorMessage,
        status: 'failed',
      });
    }

    res.status(200).json({ status: 'succeeded' });
  } else {
    return res
      .status(401)
      .send("Unauthorized: campaign doesn't exist or isn't your campaign");
  }
}
