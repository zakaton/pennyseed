import Stripe from 'stripe';
import enforceApiRouteSecret from '../../../utils/enforce-api-route-secret';
import { getSupabaseService, paginationSize } from '../../../utils/supabase';
import {
  getPennyseedFee,
  getPledgeDollars,
  getPledgeDollarsPlusFees,
  getStripeFee,
  formatDollars,
} from '../../../utils/campaign-utils';
import sendEmail, { emailAdmin } from '../../../utils/send-email';

async function chargePledge({
  supabase,
  stripe,
  pledge,
  campaign,
  defaultPaymentIntentOptions,
}) {
  console.log('pledgeToCharge', pledge);

  if (!pledge.payment_intent && pledge.payment_method) {
    const paymentIntentOptions = {
      currency: 'usd',
      transfer_data: {
        destination: campaign.created_by.stripe_account,
      },
      payment_method: pledge.payment_method,
      confirm: true,
      off_session: true,
      payment_method_types: ['card'],
      customer: pledge.profile.stripe_customer,
      ...defaultPaymentIntentOptions,
    };

    // https://stripe.com/docs/api/payment_intents/create
    let paymentIntentError;
    const paymentIntent = await stripe.paymentIntents
      .create(paymentIntentOptions)
      .catch((error) => {
        console.error('error charging pledger', error);
        paymentIntentError = error;
      });
    const { error: updatePledgeError } = await supabase
      .from('pledge')
      .update({
        payment_intent: paymentIntent?.id,
        error: paymentIntentError?.message || null,
      })
      .match({ id: pledge.id });
    if (paymentIntentError) {
      try {
        const paymentMethod = await stripe.paymentMethods.detach(
          pledge.payment_method
        );
        if (paymentMethod.customer !== null) {
          console.error(
            'unable to detach payment method',
            pledge.payment_method
          );
        }
        console.log('detached payment method', pledge.payment_method);
      } catch (error) {
        console.error('error trying to detach payment method', error);
      }
    }
    if (!updatePledgeError) {
      await supabase
        .from('profile')
        .update({
          active_campaign: null,
        })
        .eq('id', campaign.created_by.id);
    } else {
      console.error('error updating pledge', updatePledgeError);
    }
  }
}
async function chargePledges({
  supabase,
  stripe,
  from,
  to,
  campaign,
  defaultPaymentIntentOptions,
}) {
  const { data: pledgesToCharge, error } = await supabase
    .from('pledge')
    .select('*, profile(*)')
    .match({ campaign: campaign.id })
    .range(from, to);

  console.log('pledgesToCharge', pledgesToCharge);

  if (!error) {
    const chargePledgePromises = pledgesToCharge.map((pledge) =>
      chargePledge({
        supabase,
        stripe,
        pledge,
        campaign,
        defaultPaymentIntentOptions,
      })
    );
    await Promise.all(chargePledgePromises);
  } else {
    console.error('error fetching pledges', error);
  }
}

async function emailPledgers({ supabase, from, to, campaign, succeeded }) {
  const { data: pledgesToEmail, error } = await supabase
    .from('pledge')
    .select('*, profile!inner(*)')
    .match({ campaign: campaign.id })
    .contains('profile.notifications', ['email_campaign_end'])
    .range(from, to);

  console.log('pledgesToEmail', pledgesToEmail);

  if (!error) {
    await sendEmail(
      ...pledgesToEmail.map((pledge) => ({
        to: pledge.profile.email,
        subject: `A Campaign you Pledged to ${
          succeeded ? 'Succeeded' : 'Failed'
        }`,
        dynamicTemplateData: {
          heading: `A Campaign you pledged to has ${
            succeeded ? 'succeeded' : 'failed'
          }`,
          body: `A campaign trying to raise ${formatDollars(
            campaign.funding_goal,
            false
          )} for ${campaign.reason} has ${succeeded ? 'succeeded' : 'failed'}.`,
          optional_link: 'Go to Campaign',
          optional_link_url: `${process.env.NEXT_PUBLIC_URL}/campaign/${campaign.id}`,
        },
      }))
    );
  } else {
    console.error('error fetching pledges', error);
  }
}

async function processCampaign({ supabase, stripe, campaign }) {
  console.log('campaignToProcess', campaign);

  const succeeded =
    campaign.approved &&
    campaign.number_of_pledgers >= campaign.minimum_number_of_pledgers;
  console.log('campaign succeeeded?', succeeded);

  if (campaign.created_by.active_campaign === campaign.id) {
    const upateProfileResult = await supabase
      .from('profile')
      .update({
        active_campaign: null,
      })
      .eq('id', campaign.created_by.id);
    console.log('update profile result', upateProfileResult);
  }
  const { error: updateCampaignError } = await supabase
    .from('campaign')
    .update({
      processed: true,
      succeeded,
    })
    .match({ id: campaign.id });
  if (!updateCampaignError) {
    await emailAdmin({
      subject: `Campaign [${campaign.id}] has Ended`,
      dynamicTemplateData: {
        heading: `A Campaign has ${succeeded ? 'Succeeded' : 'Failed'}`,
        body: `A campaign trying to raise ${formatDollars(
          campaign.funding_goal,
          false
        )} for ${campaign.reason} has ${succeeded ? 'succeeded' : 'failed'}.`,
        optional_link: 'Go to Campaign',
        optional_link_url: `${process.env.NEXT_PUBLIC_URL}/campaign/${campaign.id}`,
      },
    });
    if (campaign.created_by.notifications?.includes('email_campaign_end')) {
      await sendEmail({
        to: campaign.created_by.email,
        subject: `Your Campaign ${succeeded ? 'Succeeded' : 'Failed'}`,
        dynamicTemplateData: {
          heading: `Your campaign ${succeeded ? 'succeeded' : 'failed'}.`,
          body: `Your campaign trying to raise ${formatDollars(
            campaign.funding_goal
          )} has ${succeeded ? 'succeeded' : 'failed'}`,
          optional_link: 'Go to Campaign',
          optional_link_url: `${process.env.NEXT_PUBLIC_URL}/campaign/${campaign.id}`,
        },
      });
    }
  } else {
    console.error('error updating campaign', updateCampaignError);
  }

  if (succeeded) {
    const { error: getNumberOfPledgesError, count: numberOfPledgesToProcess } =
      await supabase
        .from('pledge')
        .select('*', { count: 'exact', head: true })
        .match({ campaign: campaign.id });
    console.log('getNumberOfPledgesError', getNumberOfPledgesError);
    console.log('numberOfPledgesToProcess', numberOfPledgesToProcess);

    if (numberOfPledgesToProcess > 0) {
      const pledgeDollarsPlusFees = getPledgeDollarsPlusFees(
        campaign.funding_goal,
        campaign.number_of_pledgers
      );
      const pledgeDollars = getPledgeDollars(
        campaign.funding_goal,
        campaign.number_of_pledgers
      );
      const pennyseedFee = getPennyseedFee(pledgeDollars);
      const stripeFee = getStripeFee(pledgeDollarsPlusFees);
      const defaultPaymentIntentOptions = {
        amount: Math.round(pledgeDollarsPlusFees * 100),
        application_fee_amount: Math.round((stripeFee + pennyseedFee) * 100),
      };

      const chargePledgesPromises = [];
      for (
        let from = 0, to = paginationSize - 1;
        from < numberOfPledgesToProcess;
        from += paginationSize, to += paginationSize
      ) {
        const chargePledgesPromise = chargePledges({
          supabase,
          stripe,
          from,
          to,
          campaign,
          defaultPaymentIntentOptions,
        });

        chargePledgesPromises.push(chargePledgesPromise);
      }
      await Promise.all(chargePledgesPromises);
    }
  }

  const {
    error: getNumberOfPledgesToEmailError,
    count: numberOfPledgesToEmail,
  } = await supabase
    .from('pledge, profile!inner(*)')
    .select('*', { count: 'exact', head: true })
    .match({ campaign: campaign.id })
    .contains('profile.notifications', ['email_campaign_ended']);
  console.log('getNumberOfPledgesToEmailError', getNumberOfPledgesToEmailError);
  console.log('numberOfPledgesToEmail', numberOfPledgesToEmail);

  if (numberOfPledgesToEmail > 0) {
    const emailPledgersPromises = [];
    for (
      let from = 0, to = paginationSize - 1;
      from < numberOfPledgesToEmail;
      from += paginationSize, to += paginationSize
    ) {
      const emailPledgersPromise = emailPledgers({
        supabase,
        from,
        to,
        campaign,
        succeeded,
      });
      emailPledgersPromises.push(emailPledgersPromise);
    }
    await Promise.all(emailPledgersPromises);
  }
}
async function processCampaigns({ supabase, stripe, from, to, currentDate }) {
  const { data: campaignsToProcess, error } = await supabase
    .from('campaign')
    .select('*, created_by(*)')
    .match({ processed: false })
    .lte('deadline', currentDate.toISOString())
    .range(from, to);

  console.log('campaignsToProcess', campaignsToProcess);

  if (!error) {
    const processCampaignPromises = campaignsToProcess.map((campaign) =>
      processCampaign({ supabase, stripe, campaign })
    );
    await Promise.all(processCampaignPromises);
  } else {
    console.error('error fetching campaigns', error);
  }
}

async function processPledgesEndingIn24Hours({ supabase, from, to, campaign }) {
  const { data: pledgesToEmail, error } = await supabase
    .from('pledge')
    .select('*, profile!inner(*)')
    .match({ campaign: campaign.id })
    .contains('profile.notifications', ['email_campaign_end_soon'])
    .range(from, to);

  console.log('pledgesToEmail', pledgesToEmail);

  if (!error) {
    await sendEmail(
      ...pledgesToEmail.map((pledge) => ({
        to: pledge.profile.email,
        subject: `A Campaign you pledged to is ending soon`,
        dynamicTemplateData: {
          heading: 'A Campaign you pledged to is ending soon',
          body: 'A Campaign you pledged to is ending soon',
          optional_link: 'Go to Campaign',
          optional_link_url: `${process.env.NEXT_PUBLIC_URL}/campaign/${campaign.id}`,
        },
      }))
    );
  } else {
    console.error('error fetching pledges', error);
  }
}

async function processCampaignEndingIn24Hours({ supabase, campaign }) {
  console.log('campaignEndingIn24HoursToProcess', campaign);

  const { error: getNumberOfPledgesError, count: numberOfPledgesToProcess } =
    await supabase
      .from('pledge')
      .select('*', { count: 'exact', head: true })
      .match({ campaign: campaign.id });

  console.log('getNumberOfPledgesError', getNumberOfPledgesError);
  console.log('numberOfPledgesToProcess', numberOfPledgesToProcess);
  if (numberOfPledgesToProcess > 0) {
    const processPledgesEndingIn24HoursPromises = [];
    for (
      let from = 0, to = paginationSize - 1;
      from < numberOfPledgesToProcess;
      from += paginationSize, to += paginationSize
    ) {
      const processPledgesEndingIn24HoursPromise =
        processPledgesEndingIn24Hours({ supabase, from, to, campaign });
      processPledgesEndingIn24HoursPromises.push(
        processPledgesEndingIn24HoursPromise
      );
    }
    await Promise.all(processPledgesEndingIn24HoursPromises);
  }

  await emailAdmin({
    subject: `Campaign is Ending in 24 Hours`,
    dynamicTemplateData: {
      heading: `Campaign ${campaign.id} is ending in 24 hours`,
      body: `A campaign trying to raise ${formatDollars(
        campaign.funding_goal,
        false
      )} for ${campaign.reason} will end in 24 hours.`,
      optional_link: 'Go to Campaign',
      optional_link_url: `${process.env.NEXT_PUBLIC_URL}/campaign/${campaign.id}`,
    },
  });
  if (campaign.created_by.notifications?.includes('email_campaign_end_soon')) {
    await sendEmail({
      to: campaign.created_by.email,
      subject: `Your Campaign will end in 24 hours`,
      dynamicTemplateData: {
        heading: `Your Campaign will end in 24 hours`,
        body: `Your campaign trying to raise ${formatDollars(
          campaign.funding_goal
        )} will end in 24 hours`,
        optional_link: 'Go to Campaign',
        optional_link_url: `${process.env.NEXT_PUBLIC_URL}/campaign/${campaign.id}`,
      },
    });
  }
}
async function processCampaignsEndingIn24Hours({
  supabase,
  from,
  to,
  hourBeforeDayAfterCurrentDate,
  dayAfterCurrentDate,
}) {
  const { data: campaignsEndingIn24HoursToProcess, error } = await supabase
    .from('campaign')
    .select('*, created_by(*)')
    .match({ processed: false })
    .gt('deadline', hourBeforeDayAfterCurrentDate.toISOString())
    .lte('deadline', dayAfterCurrentDate.toISOString())
    .range(from, to);

  console.log(
    'campaignsEndingIn24HoursToProcess',
    campaignsEndingIn24HoursToProcess
  );

  if (!error) {
    const campaignsEndingIn24HoursToProcessPromises =
      campaignsEndingIn24HoursToProcess.map((campaign) =>
        processCampaignEndingIn24Hours({ supabase, campaign })
      );
    await Promise.all(campaignsEndingIn24HoursToProcessPromises);
  } else {
    console.error('error fetching campaigns', error);
  }
}

// eslint-disable-next-line consistent-return
export default async function handler(req, res) {
  if (false && !enforceApiRouteSecret(req, res)) {
    return;
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = getSupabaseService();

  const currentDate = new Date();

  const {
    error: getNumberOfCampaignsError,
    count: numberOfCampaignsToProcess,
  } = await supabase
    .from('campaign')
    .select('*', { count: 'exact', head: true })
    .match({ processed: false })
    .lte('deadline', currentDate.toISOString());

  console.log('getNumberOfCampaignsError', getNumberOfCampaignsError);
  console.log('numberOfCampaignsToProcess', numberOfCampaignsToProcess);
  if (numberOfCampaignsToProcess > 0) {
    const processCampaignsPromises = [];
    for (
      let from = 0, to = paginationSize - 1;
      from < numberOfCampaignsToProcess;
      from += paginationSize, to += paginationSize
    ) {
      const processCampaignsPromise = processCampaigns({
        supabase,
        stripe,
        from,
        to,
        currentDate,
      });
      processCampaignsPromises.push(processCampaignsPromise);
    }
    await Promise.all(processCampaignsPromises);
  }

  const dayAfterCurrentDate = new Date(currentDate);
  dayAfterCurrentDate.setHours(dayAfterCurrentDate.getHours() + 24);
  const hourBeforeDayAfterCurrentDate = new Date(dayAfterCurrentDate);
  hourBeforeDayAfterCurrentDate.setHours(
    hourBeforeDayAfterCurrentDate.getHours() - 1
  );

  const {
    error: getNumberOfCampaignsEndingIn24HoursError,
    count: numberOfCampaignsEndingIn24HoursToProcess,
  } = await supabase
    .from('campaign')
    .select('*', { count: 'exact', head: true })
    .match({ processed: false })
    .gt('deadline', hourBeforeDayAfterCurrentDate.toISOString())
    .lte('deadline', dayAfterCurrentDate.toISOString());

  console.log(
    'getNumberOfCampaignsEndingIn24HoursError',
    getNumberOfCampaignsEndingIn24HoursError
  );
  console.log(
    'numberOfCampaignsEndingIn24HoursToProcess',
    numberOfCampaignsEndingIn24HoursToProcess
  );
  if (numberOfCampaignsEndingIn24HoursToProcess > 0) {
    const processCampaignsEndingIn24HoursPromises = [];
    for (
      let from = 0, to = paginationSize - 1;
      from < numberOfCampaignsEndingIn24HoursToProcess;
      from += paginationSize, to += paginationSize
    ) {
      const processCampaignsEndingIn24HoursPromise =
        processCampaignsEndingIn24Hours({
          supabase,
          from,
          to,
          hourBeforeDayAfterCurrentDate,
          dayAfterCurrentDate,
        });
      processCampaignsEndingIn24HoursPromises.push(
        processCampaignsEndingIn24HoursPromise
      );
    }
    await Promise.all(processCampaignsEndingIn24HoursPromises);
  }

  res.status(200).send('checked campaigns');
}
