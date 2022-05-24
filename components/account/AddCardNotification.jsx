import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import getStripe from '../../utils/get-stripe';
import Notification from '../Notification';

const addCardNotificationStatuses = {
  succeeded: {
    type: 'succeeded',
    title: 'Successfully added card',
  },
  processing: {
    type: 'warning',
    title: 'Processing Payment Method',
    message: 'Please come back later',
  },
  requires_payment_method: { type: 'warning' },
  requires_confirmation: { type: 'warning' },
  requires_action: {
    type: 'warning',
  },
  canceled: {
    type: 'warning',
  },
};

export default function AddCardNotification({ open, setOpen }) {
  const router = useRouter();
  const [status, setStatus] = useState();
  const [stripe, setStripe] = useState(null);
  useEffect(() => {
    const awaitStripe = async () => {
      // eslint-disable-next-line no-shadow
      const stripe = await getStripe();
      setStripe(stripe);
    };
    awaitStripe();
  }, []);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'setup_intent_client_secret'
    );

    if (clientSecret) {
      stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
        console.log(setupIntent);
        // https://stripe.com/docs/js/setup_intents/retrieve_setup_intent
        setStatus(addCardNotificationStatuses[setupIntent.status]);
        setOpen(true);

        const urlWithoutQuery =
          window.location.origin +
          window.location.pathname +
          window.location.hash;
        router.replace(urlWithoutQuery, undefined, { shallow: true });
      });
    }
  }, [stripe]);

  return <Notification open={open} setOpen={setOpen} status={status} />;
}
