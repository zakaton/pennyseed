/* eslint-disable camelcase */
import { buffer } from 'micro';
import Stripe from 'stripe';
import { getSupabaseService } from '../../../../utils/supabase';
import { maxNumberOfPaymentMethods } from '../../../../utils/get-stripe-payment-methods';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_CUSTOMER_WEBHOOK_SECRET;
const supabase = getSupabaseService();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
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
          const { data: profile } = await supabase
            .from('profile')
            .select('*')
            .eq('stripe_customer', payment_method.customer)
            .single();
          if (profile) {
            const paymentMethods = await stripe.paymentMethods.list({
              customer: profile.stripe_customer,
              type: 'card',
              limit: maxNumberOfPaymentMethods,
            });
            await supabase
              .from('profile')
              .update({ number_of_payment_methods: paymentMethods.data.length })
              .eq('stripe_customer', profile.stripe_customer);
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
