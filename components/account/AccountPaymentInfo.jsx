/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import AddCardModal from './AddCardModal';
import RemoveCardModal from './RemoveCardModal';
import AddCardStatusModal from './AddCardStatusModal';
import getStripePaymentMethods from '../../utils/get-stripe-payment-methods';

export default function AccountPaymentInfo({ isActive }) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showRemoveCardModal, setShowRemoveCardModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [stripePaymentMethods, setStripePaymentMethods] = useState(null);
  useEffect(() => {
    if (!stripePaymentMethods && isActive) {
      getStripePaymentMethods().then((data) => {
        setStripePaymentMethods(data.stripePaymentMethods);
      });
    }
  }, [stripePaymentMethods, isActive]);

  let paymentMethodsContent;
  if (stripePaymentMethods) {
    if (stripePaymentMethods.length > 0) {
      paymentMethodsContent = stripePaymentMethods.map((paymentMethod) => (
        <div
          key={paymentMethod.id}
          className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5"
        >
          <dt className="text-sm font-medium text-gray-500 sm:col-span-1">
            {paymentMethod.card.brand.charAt(0).toUpperCase() +
              paymentMethod.card.brand.slice(1)}{' '}
            ending in {paymentMethod.card.last4}
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-yellow-100 px-2 py-1 text-sm font-medium leading-4 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              view pledges using this card
            </button>
          </dd>
          <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
            <button
              type="button"
              onClick={() => {
                setSelectedPaymentMethod(paymentMethod);
                setShowRemoveCardModal(true);
              }}
              className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-2 py-1 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              remove card
            </button>
          </dd>
        </div>
      ));
    } else {
      paymentMethodsContent = (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
          <dt className="text-sm font-medium text-gray-500">
            No cards available
          </dt>
          <dd className="mt-1 text-sm font-medium text-gray-500 sm:col-span-2 sm:mt-0">
            You need to{' '}
            <button
              type="button"
              onClick={() => setShowAddCard(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-2 py-1 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              add a card
            </button>{' '}
            in order to pledge to campaigns
          </dd>
        </div>
      );
    }
  } else {
    paymentMethodsContent = (
      <div className="py-4 text-center sm:py-5">
        <div className="text-sm font-medium text-gray-500">
          loading payment info...
        </div>
      </div>
    );
  }

  return (
    <>
      <AddCardModal open={showAddCard} setOpen={setShowAddCard} />
      <AddCardStatusModal />
      <RemoveCardModal
        open={showRemoveCardModal}
        setOpen={setShowRemoveCardModal}
        selectedPaymentMethod={selectedPaymentMethod}
      />
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white px-4 pb-1 pt-6 sm:px-6 sm:pt-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Payment Info
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add and remove payment methods.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={() => setShowAddCard(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add card
              </button>
            </div>
          </div>

          <div className="mt-5 border-t border-gray-200">
            <dl className="sm:divide-y sm:divide-gray-200">
              {paymentMethodsContent}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
