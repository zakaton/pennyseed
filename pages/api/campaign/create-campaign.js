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
  const supabase = getSupabaseService(req);
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

    console.log(
      'minutes away',
      (deadline.getTime() - Date.now()) / (1000 * 60)
    );

    console.log(reason, fundingGoal, minimumNumberOfPledgers, deadline);
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

    console.log(errorMessage);

    if (errorMessage) {
      return res.status(200).json({
        error: errorMessage,
      });
    }

    return res.status(200).json({
      campaignId: 0,
    });

    const { data: campaign, error } = await supabase
      .from('campaign')
      .insert([{ created_by: profile.id }]);

    if (!error) {
      res.status(200).json({
        campaignId: campaign.id,
      });
    } else {
      res.status(200).json({
        error,
      });
    }
  }

  res.status(200).json({
    error: `unable to create campaign: ${
      profile?.can_create_campaigns
        ? "user hasn't completed their stripe account"
        : 'user already has an active campaign'
    }`,
  });
}
