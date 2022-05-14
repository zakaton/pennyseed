/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';
import {
  getMaximumPossibleNumberOfPledgers,
  getMinimumPossibleNumberOfPledgers,
  maximumCampaignDollars,
  maximumCampaignReasonLength,
  minimumCampaignDollars,
} from '../../../utils/campaign-utils';

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const profile = await getUserProfile(user, supabase);
  if (profile?.can_create_campaigns && !profile?.has_active_campaign) {
    let {
      reason,
      fundingGoal,
      minimumNumberOfPledgers,
      deadline,
      agreeToTermsOfUse,
    } = req.body;
    reason = reason.substr(0, maximumCampaignReasonLength);
    fundingGoal = Math.round(Number(fundingGoal));
    minimumNumberOfPledgers = Math.round(Number(minimumNumberOfPledgers));
    deadline = new Date(Number(deadline));
    agreeToTermsOfUse = Boolean(agreeToTermsOfUse);

    const minimumPossibleNumberOfPledgers =
      getMinimumPossibleNumberOfPledgers(fundingGoal);
    const maximumPossibleNumberOfPledgers =
      getMaximumPossibleNumberOfPledgers(fundingGoal);

    let errorMessage;
    if (reason.length === 0) {
      errorMessage = 'campaign must have a reason';
    } else if (
      fundingGoal < minimumCampaignDollars ||
      fundingGoal > maximumCampaignDollars
    ) {
      errorMessage = `funding goal must be between $${minimumCampaignDollars} and $${maximumCampaignDollars}`;
    } else if (
      minimumNumberOfPledgers < minimumPossibleNumberOfPledgers ||
      minimumNumberOfPledgers > maximumPossibleNumberOfPledgers
    ) {
      errorMessage = `minimum number of pledgers must be between ${minimumPossibleNumberOfPledgers} and ${maximumPossibleNumberOfPledgers}`;
    } else if (deadline.getTime() < Date.now()) {
      errorMessage = 'deadline must be a future date';
    } else if (!agreeToTermsOfUse) {
      errorMessage = 'user must agree to the terms of use';
    }

    if (errorMessage) {
      return res.status(200).json({
        error: errorMessage,
      });
    }

    const { data: campaigns, error } = await supabase.from('campaign').insert([
      {
        created_by: user.id,
        reason,
        funding_goal: fundingGoal,
        minimum_number_of_pledgers: minimumNumberOfPledgers,
        deadline,
      },
    ]);

    if (!error) {
      await supabase
        .from('profile')
        .update({
          has_active_campaign: true,
        })
        .eq('id', user.id);

      res.status(200).json({
        campaignId: campaigns[0].id,
      });
    } else {
      res.status(200).json({
        error,
      });
    }
  }
}