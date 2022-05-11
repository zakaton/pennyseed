import { buffer } from 'micro';
import Stripe from 'stripe';
import { getSupabaseService } from '../../../utils/supabase';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
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
      case 'account.updated':
        {
          const account = event.data.object;
          await supabase
            .from('profile')
            .update({
              has_completed_onboarding: account.details_submitted,
              can_create_campaigns: account.charges_enabled,
            })
            .eq('stripe_account', account.id);
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
