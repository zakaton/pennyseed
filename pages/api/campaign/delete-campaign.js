/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import {
  getSupabaseService,
  getUserProfile,
  paginationSize,
} from '../../../utils/supabase';
import sendEmail, { emailAdmin } from '../../../utils/send-email';

async function emailPledgers(supabase, campaign, from, to) {
  const { data: pledgesToEmail, error } = await supabase
    .from('pledge')
    .select('*, profile(*)')
    .match({ campaign: campaign.id })
    .contains('notifications', ['email_campaign_end_soon'])
    .range(from, to);

  console.log('pledgesToEmail', pledgesToEmail);

  if (!error) {
    return sendEmail(
      pledgesToEmail.map((pledge) => ({
        to: pledge.profile.email,
        subject: `A Campaign you pledged to is ending soon`,
        text: 'A Campaign you pledged to is ending soon',
        html: `<h1>A Campaign you pledged is ending soon</h1> <p>A <a href="https://pennyseed.vercel.app/campaign/${campaign.id}">campaign</a> you pledged to is ending soon</p>`,
      }))
    );
  }
  console.error('error fetching pledges', error);
}

async function processCampaignEmails(supabase, campaign) {
  await emailAdmin({
    subject: 'Campaign Deleted',
    text: `Campaign ${campaign.id} was deleted`,
    html: `<h1>Campaign Ended</h1> <p>A campaign was deleted</p>`,
  });

  const {
    error: getNumberOfPledgesToEmailError,
    count: numberOfPledgesToEmail,
  } = await supabase
    .from('pledge')
    .select('*', { count: 'exact' })
    .match({
      campaign: campaign.id,
    })
    .contains('notifications', ['email_campaign_deleted']);

  console.log('getNumberOfPledgesToEmailError', getNumberOfPledgesToEmailError);
  console.log('numberOfPledgesToEmail', numberOfPledgesToEmail);

  const emailPledgersPromises = [];
  if (numberOfPledgesToEmail > 0) {
    for (
      let from = 0, to = paginationSize - 1;
      from < numberOfPledgesToEmail;
      from += paginationSize, to += paginationSize
    ) {
      const emailPledgersPromise = emailPledgers(supabase, campaign, from, to);
      emailPledgersPromises.push(emailPledgersPromise);
    }
  }
  await Promise.all(emailPledgersPromises);
}

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
    .select('*, created_by(*)')
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

    await processCampaignEmails(supabase, campaign);

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
