/* eslint-disable consistent-return */
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';
import updateCampaignNumberOfPledgers from '../../../utils/update-campaign-number-of-pledgers';

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

  const { campaignId } = req.body;
  if (!campaignId) {
    return sendErrorMessage('campaignId not found in form body');
  }

  const { data: campaign } = await supabase
    .from('campaign')
    .select('*')
    .match({ id: campaignId })
    .single();

  if (!campaign) {
    return sendErrorMessage('campaign not found');
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

  if (!existingPledge) {
    return sendErrorMessage("there's no pledge to remove");
  }

  const deletePledgeResult = await supabase
    .from('pledge')
    .delete()
    .match({ campaign: campaignId, pledger: user.id });
  console.log('delete pledge result', deletePledgeResult);

  await updateCampaignNumberOfPledgers(campaignId, supabase);

  res.status(200).json({ status: 'succeeded' });
}
