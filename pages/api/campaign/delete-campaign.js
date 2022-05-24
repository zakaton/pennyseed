/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res
      .status(200)
      .json({ status: { type: 'failed', title: "You're not signed in" } });
  }
  if (!req.body.campaignId) {
    return res.status(200).json({
      status: {
        type: 'failed',
        title: 'Unable to delete campaign',
        mesage: 'No campaign was specified',
      },
    });
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

    res.status(200).json({
      status: { type: 'succeeded', title: 'Successfully deleted campaign' },
    });
  } else {
    return res.status(200).json({
      status: {
        type: 'failed',
        title: "Campaign isn't yours or doesn't exit",
      },
    });
  }
}
