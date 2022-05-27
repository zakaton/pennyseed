import Stripe from 'stripe';
import enforceApiRouteSecret from '../../../utils/enforce-api-route-secret';
import { getSupabaseService } from '../../../utils/supabase';
import {
  getPennyseedFee,
  getPledgeDollars,
  getPledgeDollarsPlusFees,
  getStripeFee,
} from '../../../utils/campaign-utils';
import { emailAdmin } from '../../../utils/send-email';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = getSupabaseService();
const paginationSize = 1_000;

async function processPledge(pledge, campaign, defaultPaymentIntentOptions) {
  console.log('pledgeToProcess', pledge);

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
    const paymentIntent = await stripe.paymentIntents
      .create(paymentIntentOptions)
      .catch((error) => {
        console.error('error charging pledger', error);
      });
    const { error: updatePledgeError } = await supabase
      .from('pledge')
      .update({
        payment_intent: paymentIntent.id,
      })
      .match({ id: pledge.id });
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
async function processPledges(from, to, campaign) {
  const { data: pledgesToProcess, error } = await supabase
    .from('pledge')
    .select('*, profile(*)')
    .match({ campaign: campaign.id })
    .range(from, to);

  console.log('pledgesToProcess', pledgesToProcess);

  if (!error) {
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

    pledgesToProcess.forEach((pledge) => {
      processPledge(pledge, campaign, defaultPaymentIntentOptions);
    });
  } else {
    console.error('error fetching pledges', error);
  }
}

async function processCampaign(campaign) {
  console.log('campaignToProcess', campaign);

  const successful =
    campaign.approved &&
    campaign.number_of_pledgers >= campaign.minimum_number_of_pledgers;
  console.log('campaign succeeeded?', successful);
  if (successful) {
    const { error: getNumberOfPledgesError, count: numberOfPledgesToProcess } =
      await supabase
        .from('pledge')
        .select('*', { count: 'exact' })
        .match({ campaign: campaign.id });

    console.log('getNumberOfPledgesError', getNumberOfPledgesError);
    console.log('numberOfPledgesToProcess', numberOfPledgesToProcess);
    if (numberOfPledgesToProcess > 0) {
      for (
        let from = 0, to = paginationSize - 1;
        from < numberOfPledgesToProcess;
        from += paginationSize, to += paginationSize
      ) {
        processPledges(from, to, campaign);
      }
    }
  }

  const { error: updateCampaignError } = await supabase
    .from('campaign')
    .update({
      processed: true,
      successful,
    })
    .match({ id: campaign.id });
  if (updateCampaignError) {
    console.error('error updating campaign', updateCampaignError);
  }
}
async function processCampaigns(from, to, currentDate) {
  const { data: campaignsToProcess, error } = await supabase
    .from('campaign')
    .select('*, created_by(*)')
    .match({ processed: false })
    .lte('deadline', currentDate.toISOString())
    .range(from, to);

  console.log('campaignsToProcess', campaignsToProcess);

  if (!error) {
    campaignsToProcess.forEach((campaign) => {
      processCampaign(campaign);
    });
  } else {
    console.error('error fetching campaigns', error);
  }
}

// eslint-disable-next-line consistent-return
export default async function handler(req, res) {
  if (!enforceApiRouteSecret(req, res)) {
    return;
  }

  const currentDate = new Date();

  const {
    error: getNumberOfCampaignsError,
    count: numberOfCampaignsToProcess,
  } = await supabase
    .from('campaign')
    .select('*', { count: 'exact' })
    .match({ processed: false })
    .lte('deadline', currentDate.toISOString());

  console.log('getNumberOfCampaignsError', getNumberOfCampaignsError);
  console.log('numberOfCampaignsToProcess', numberOfCampaignsToProcess);
  if (numberOfCampaignsToProcess > 0) {
    for (
      let from = 0, to = paginationSize - 1;
      from < numberOfCampaignsToProcess;
      from += paginationSize, to += paginationSize
    ) {
      processCampaigns(from, to, currentDate);
    }
  }

  try {
    await emailAdmin({
      subject: 'Check Campaigns',
      text: `check campaigns`,
      html: `<h1>Check Campaigns</h1> <p>we checked campaigns</p>`,
    });
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }

  res.status(200).send('checked campaigns');
}
