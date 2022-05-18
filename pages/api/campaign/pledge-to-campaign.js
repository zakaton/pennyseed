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

  const sendErrorMessage = (errorMessage) =>
    res.status(200).json({
      error: errorMessage,
      status: 'failed',
    });

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

  const profile = await getUserProfile(user, supabase);
  if (!profile) {
    return sendErrorMessage('user profile not found');
  }

  const { data: existingPledge } = await supabase
    .from('pledge')
    .select('*')
    .eq('pledger', profile.id)
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
        pledger: profile.id,
        payment_method: paymentMethodId,
        campaign: campaignId,
      },
    ]);
  console.log('create pledge result', createdPledge, createPledgeError);

  const { error: getNumberOfPledgersError, count: numberOfPledgers } =
    await supabase
      .from(`pledge`)
      .select('*', { count: 'exact', head: true })
      .match({ campaign: campaignId });
  console.log(
    'get number of pledgers result',
    numberOfPledgers,
    getNumberOfPledgersError
  );

  const updateCampaignResult = await supabase
    .from('campaign')
    .update({
      number_of_pledgers: numberOfPledgers,
    })
    .match({ id: campaignId });

  console.log('update campaign result', updateCampaignResult);

  res.status(200).json({ status: 'succeeded' });
}
