/* eslint-disable camelcase */
import { buffer } from 'micro';
import Stripe from 'stripe';
import { getSupabaseService } from '../../../../utils/supabase';
import { maxNumberOfPaymentMethods } from '../../../../utils/get-payment-methods';
import updateCampaignNumberOfPledgers from '../../../../utils/update-campaign-number-of-pledgers';

const webhookSecret = process.env.STRIPE_CUSTOMER_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = getSupabaseService();

  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'payment_method.attached':
      case 'payment_method.detached':
        {
          const payment_method = event.data.object;
          const customerId =
            event.type === 'payment_method.attached'
              ? payment_method.customer
              : event.data.previous_attributes.customer;
          const { data: profile } = await supabase
            .from('profile')
            .select('*')
            .eq('stripe_customer', customerId)
            .single();
          if (profile) {
            const { data: paymentMethods } = await stripe.paymentMethods.list({
              customer: profile.stripe_customer,
              type: 'card',
              limit: maxNumberOfPaymentMethods,
            });
            await supabase
              .from('profile')
              .update({ number_of_payment_methods: paymentMethods.length })
              .eq('stripe_customer', profile.stripe_customer);

            if (event.type === 'payment_method.detached') {
              const { data: pledges, error: deletePledgesError } =
                await supabase
                  .from('pledge')
                  .delete()
                  .eq('payment_method', payment_method.id);
              console.log('delete pledges result', deletePledgesError, pledges);

              const updateCampaignNumberOfPledgersPromises = pledges.map(
                async (pledge) =>
                  updateCampaignNumberOfPledgers(pledge.campaign, supabase)
              );
              await Promise.all(updateCampaignNumberOfPledgersPromises);
            }
          }
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
