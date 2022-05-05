/* eslint-disable camelcase */
import { Elements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import ElementsForm from './ElementsForm';
import getStripe from '../../utils/get-stripe';

export default function AccountPaymentInfo() {
  const [stripePromise, setStripePromise] = useState(() => getStripe());
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    console.log('getting client secret!');
    /*
    async function getClientSecret() {
      const response = await fetch('/api/create-stripe-setup-intent', {
        cache: 'no-cache',
      });
      const { client_secret } = await response.json();
      setClientSecret(client_secret);
    }
    getClientSecret();
    */
    fetch('/api/create-stripe-setup-intent')
      .then((response) => response.json())
      .then(({ client_secret }) => setClientSecret(client_secret));
  }, []);

  console.log(clientSecret);

  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md">
      <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Payment Info
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add and remove payment methods.
          </p>
        </div>
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <ElementsForm />
          </Elements>
        )}
      </div>
    </div>
  );
}
