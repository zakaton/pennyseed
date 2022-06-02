/* eslint-disable consistent-return */
import Stripe from 'stripe';
import {
  getSupabaseService,
  getUserProfile,
  getUserByAccessToken,
} from '../../../utils/supabase';
import updateCampaignNumberOfPledgers from '../../../utils/update-campaign-number-of-pledgers';
import { getMaximumPossibleNumberOfPledgers } from '../../../utils/campaign-utils';

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const sendErrorMessage = (errorMessage) =>
    res.status(200).json({
      status: {
        type: 'failed',
        title: 'Unable to Pledge to Campaign',
        message: errorMessage,
      },
    });

  const supabase = getSupabaseService();
  const { user } = await getUserByAccessToken(supabase, req);
  if (!user) {
    return sendErrorMessage('You must be signed in to Pledge');
  }

  const { campaignId, paymentMethodId } = req.body;
  if (!campaignId) {
    return sendErrorMessage('campaignId not found in form body');
  }
  if (!paymentMethodId) {
    return sendErrorMessage('paymentMethodId not found in form body');
  }

  const { data: campaign } = await supabase
    .from('campaign')
    .select('*')
    .match({ id: campaignId })
    .single();

  if (!campaign) {
    return sendErrorMessage('campaign not found');
  }
  if (campaign.created_by === user.id) {
    return sendErrorMessage('you cannot pledge to your own campaign');
  }
  if (campaign.processed) {
    return sendErrorMessage('campaign was already processed');
  }
  if (
    campaign.number_of_pledgers >=
    getMaximumPossibleNumberOfPledgers(campaign.funding_goal)
  ) {
    return sendErrorMessage('maximum number of pledgers has been reached');
  }

  const profile = await getUserProfile(user, supabase);
  if (!profile) {
    return sendErrorMessage('user profile not found');
  }

  const { data: existingPledge } = await supabase
    .from('pledge')
    .select('*')
    .eq('profile', profile.id)
    .match({ campaign: campaignId })
    .maybeSingle();

  if (existingPledge) {
    return sendErrorMessage("you've already pledged to this campaign");
  }

  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (!paymentMethod) {
    return sendErrorMessage('payment method not found');
  }

  if (paymentMethod.customer !== profile.stripe_customer) {
    return sendErrorMessage('payment method is not yours');
  }

  const { data: createdPledge, error: createPledgeError } = await supabase
    .from('pledge')
    .insert([
      {
        profile: profile.id,
        payment_method: paymentMethodId,
        campaign: campaignId,
      },
    ]);
  console.log('create pledge result', createdPledge, createPledgeError);

  await updateCampaignNumberOfPledgers(campaignId, supabase);

  res.status(200).json({
    status: { type: 'succeeded', title: 'Successfully Pledged to Campaign' },
  });
}
