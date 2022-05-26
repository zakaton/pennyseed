/* eslint-disable consistent-return */
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';
import updateCampaignNumberOfPledgers from '../../../utils/update-campaign-number-of-pledgers';

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(200).json({
      status: {
        type: 'failed',
        title: 'You must be signed in to remove a pledge',
      },
    });
  }

  const sendErrorMessage = (errorMessage) =>
    res.status(200).json({
      status: {
        type: 'failed',
        title: 'Unable to remove pledge',
        message: errorMessage,
      },
    });

  const { campaignId } = req.body;
  if (!campaignId) {
    return sendErrorMessage('Campaign not defined');
  }

  const { data: campaign } = await supabase
    .from('campaign')
    .select('*')
    .match({ id: campaignId })
    .single();

  if (!campaign) {
    return sendErrorMessage('Campaign not Found');
  }

  const profile = await getUserProfile(user, supabase);
  if (!profile) {
    return sendErrorMessage('User not found');
  }

  const { data: existingPledge } = await supabase
    .from('pledge')
    .select('*')
    .eq('profile', user.id)
    .match({ campaign: campaignId })
    .maybeSingle();

  if (!existingPledge) {
    return sendErrorMessage("There's no pledge to remove");
  }

  const deletePledgeResult = await supabase
    .from('pledge')
    .delete()
    .match({ campaign: campaignId, profile: user.id });
  console.log('delete pledge result', deletePledgeResult);

  await updateCampaignNumberOfPledgers(campaignId, supabase);

  res.status(200).json({
    status: { type: 'succeeded', title: 'Successfully removed pledge' },
  });
}
