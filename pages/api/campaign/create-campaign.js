/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { getSupabaseService, getUserProfile } from '../../../utils/supabase';
import {
  getMaximumPossibleNumberOfPledgers,
  getMinimumPossibleNumberOfPledgers,
  maximumCampaignDollars,
  maximumCampaignReasonLength,
  minimumCampaignDollars,
  getLatestDeadline,
} from '../../../utils/campaign-utils';

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(200).json({
      status: {
        type: 'failed',
        title: 'You must be signed in to create a campaign',
      },
    });
  }

  const profile = await getUserProfile(user, supabase);
  if (profile?.can_create_campaigns && !profile?.active_campaign) {
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
    deadline.setMinutes(0, 0, 0);
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
    } else if (deadline.getTime() <= Date.now()) {
      errorMessage = 'deadline must be a future date';
    } else if (deadline.getTime() >= getLatestDeadline().getTime()) {
      errorMessage = 'deadline must be within a year';
    } else if (!agreeToTermsOfUse) {
      errorMessage = 'user must agree to the terms of use';
    }

    if (errorMessage) {
      return res.status(200).json({
        status: {
          type: 'failed',
          title: 'Failed to create campaign',
          message: errorMessage,
        },
      });
    }

    const { data: campaigns, error: insertCampaignError } = await supabase
      .from('campaign')
      .insert([
        {
          created_by: user.id,
          reason,
          funding_goal: fundingGoal,
          minimum_number_of_pledgers: minimumNumberOfPledgers,
          deadline,
        },
      ]);

    if (!insertCampaignError) {
      const campaign = campaigns[0];
      await supabase
        .from('profile')
        .update({
          active_campaign: campaign.id,
        })
        .eq('id', user.id);

      res.status(200).json({
        campaignId: campaign.id,
        status: { type: 'succeeded' },
      });
    } else {
      res.status(200).json({
        status: { type: 'failed', title: 'Unable to create campaign' },
      });
    }
  }
}
