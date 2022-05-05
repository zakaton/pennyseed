/* eslint-disable camelcase */
import { Elements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import ElementsForm from './ElementsForm';
import getStripe from '../../utils/get-stripe';

export default function AccountPaymentInfo() {
  // eslint-disable-next-line no-unused-vars
  const [stripePromise, setStripePromise] = useState(() => getStripe());

  const [clientSecret, setClientSecret] = useState(null);
  const createSetupIntent = async (override) => {
    const response = await fetch('/api/create-stripe-setup-intent');
    const { client_secret } = await response.json();
    if (clientSecret == null || override) {
      console.log('client_secret', client_secret);
      setClientSecret(client_secret);
    }
  };
  useEffect(() => {
    createSetupIntent();
  }, []);

  const [paymentMethods, setPaymentMethods] = useState(null);
  const updatePaymentMethods = async (override) => {
    const response = await fetch('/api/get-payment-methods');
    const { payment_methods } = await response.json();
    if (paymentMethods == null || override) {
      console.log('payment_methods', payment_methods);
      setPaymentMethods(payment_methods);
    }
  };
  useEffect(() => {
    updatePaymentMethods();
  }, []);

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
