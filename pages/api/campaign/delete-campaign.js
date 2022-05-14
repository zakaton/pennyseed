/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  if (!req.body.campaignId) {
    return res.status(400).send("requires a 'campaignId' form field");
  }
  const { campaignId } = req.body;

  const { data: campaign } = await supabase
    .from('campaign')
    .select('*')
    .match({ id: campaignId, created_by: user.id })
    .single();

  if (campaign) {
    const profile = await getUserProfile(user, supabase);
    if (profile.active_campaign === campaignId) {
      await supabase
        .from('profile')
        .update({
          active_campaign: null,
        })
        .eq('id', user.id);
    }
    const deletePledgesResult = await supabase
      .from('pledge')
      .delete()
      .eq('campaign', campaignId);
    console.log('delete pledges result', deletePledgesResult);

    const deleteCampaignResult = await supabase
      .from('campaign')
      .delete()
      .eq('id', campaignId);
    console.log('delete campaign result', deleteCampaignResult);

    res.status(200).json({ status: 'succeeded' });
  } else {
    return res
      .status(401)
      .send("Unauthorized: campaign doesn't exist or isn't your campaign");
  }
}
