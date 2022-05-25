// import Stripe from 'stripe';
import enforceApiRouteSecret from '../../../utils/enforce-api-route-secret';
import { getSupabaseService } from '../../../utils/supabase';

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = getSupabaseService();

// eslint-disable-next-line consistent-return
export default async function handler(req, res) {
  if (!enforceApiRouteSecret(req, res)) {
    return;
  }

  // get campaigns that have passed but not processed
  const {
    error: getNumberOfCampaignsError,
    count: numberOfCampaignsToProcess,
  } = await supabase
    .from('campaign')
    .select('*', { count: 'exact' })
    .match({ approved: true, processed: false })
    .lte('deadline', new Date().toISOString());

  console.log(getNumberOfCampaignsError, numberOfCampaignsToProcess);

  res.status(200).json({
    hello: 'world',
  });
}
