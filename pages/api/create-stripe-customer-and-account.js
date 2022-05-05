import Stripe from 'stripe';
import enforceApiRouteSecret from '../../utils/enforce-api-route-secret';
import { getSupabaseService } from '../../utils/supabase';

const supabase = getSupabaseService();

// eslint-disable-next-line consistent-return
export default async function handler(req, res) {
  console.log('received request', req.query);
  if (!enforceApiRouteSecret(req, res)) {
    return;
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const customer = await stripe.customers.create({
    email: req.body.record.email,
  });
  const account = await stripe.accounts.create({
    email: req.body.record.email,
    type: 'express',
  });

  await supabase
    .from('profile')
    .update({
      stripe_customer: customer.id,
      stripe_account: account.id,
    })
    .eq('id', req.body.record.id);

  res.send({
    message: `stripe customer ${customer.id} created and account ${account.id} created for id ${req.body.record.id}`,
  });
}
