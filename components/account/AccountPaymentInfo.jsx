/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import { CreditCardIcon } from '@heroicons/react/outline';
import AddCardModal from './AddCardModal';
import RemoveCardModal from './RemoveCardModal';
import AddCardStatusNotification from './AddCardStatusNotification';
import RemoveCardStatusNotification from './RemoveCardStatusNotification';
import getStripePaymentMethods from '../../utils/get-stripe-payment-methods';

const cardIcons = {
  visa: (props) => (
    <svg
      {...props}
      className="h-8 w-auto sm:h-6 sm:flex-shrink-0"
      viewBox="0 0 36 24"
      aria-hidden="true"
    >
      <rect width={36} height={24} fill="#224DBA" rx={4} />
      <path
        fill="#fff"
        d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
      />
    </svg>
  ),
  visa2: (props) => (
    <svg
      {...props}
      enableBackground="new 0 0 780 500"
      version="1.1"
      viewBox="0 0 780 500"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40,0h700c22.092,0,40,17.909,40,40v420c0,22.092-17.908,40-40,40H40c-22.091,0-40-17.908-40-40V40   C0,17.909,17.909,0,40,0z"
        fill="#0E4595"
      />
      <path
        d="m293.2 348.73l33.361-195.76h53.36l-33.385 195.76h-53.336zm246.11-191.54c-10.57-3.966-27.137-8.222-47.822-8.222-52.725 0-89.865 26.55-90.18 64.603-0.299 28.13 26.514 43.822 46.752 53.186 20.771 9.595 27.752 15.714 27.654 24.283-0.131 13.121-16.586 19.116-31.922 19.116-21.357 0-32.703-2.967-50.227-10.276l-6.876-3.11-7.489 43.823c12.463 5.464 35.51 10.198 59.438 10.443 56.09 0 92.5-26.246 92.916-66.882 0.199-22.269-14.016-39.216-44.801-53.188-18.65-9.055-30.072-15.099-29.951-24.268 0-8.137 9.668-16.839 30.557-16.839 17.449-0.27 30.09 3.535 39.938 7.5l4.781 2.26 7.232-42.429m137.31-4.223h-41.232c-12.773 0-22.332 3.487-27.941 16.234l-79.244 179.4h56.031s9.16-24.123 11.232-29.418c6.125 0 60.555 0.084 68.338 0.084 1.596 6.853 6.49 29.334 6.49 29.334h49.514l-43.188-195.64zm-65.418 126.41c4.412-11.279 21.26-54.723 21.26-54.723-0.316 0.522 4.379-11.334 7.074-18.684l3.605 16.879s10.219 46.729 12.354 56.528h-44.293zm-363.3-126.41l-52.24 133.5-5.567-27.13c-9.725-31.273-40.025-65.155-73.898-82.118l47.766 171.2 56.456-0.064 84.004-195.39h-56.521"
        fill="#fff"
      />
      <path
        d="m146.92 152.96h-86.041l-0.681 4.073c66.938 16.204 111.23 55.363 129.62 102.41l-18.71-89.96c-3.23-12.395-12.597-16.094-24.186-16.527"
        fill="#F2AE14"
      />
    </svg>
  ),
  default: (props) => <CreditCardIcon {...props} viewBox="0 3 24 18" />,
};

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
      paymentMethodsContent = stripePaymentMethods.map((paymentMethod) => {
        const CardIcon =
          cardIcons[paymentMethod.card.brand] || cardIcons.default;
        return (
          <div
            key={paymentMethod.id}
            className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5"
          >
            <h4 className="sr-only">
              {paymentMethod.card.brand.charAt(0).toUpperCase() +
                paymentMethod.card.brand.slice(1)}
            </h4>
            <div className="sm:flex sm:items-start">
              <CardIcon width={36} height={24} />
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <div className="text-sm font-medium text-gray-900">
                  Ending with {paymentMethod.card.last4}
                </div>
                <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                  <div>
                    Expires {paymentMethod.card.exp_month}/
                    {paymentMethod.card.exp_year.toString().slice(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-yellow-100 px-2 py-1 text-sm font-medium leading-4 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                view pledges using this card
              </button>
            </div>
            <div className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
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
            </div>
          </div>
        );
      });
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
      <AddCardStatusNotification />
      <RemoveCardStatusNotification />
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
            <div className="sm:divide-y sm:divide-gray-200">
              {paymentMethodsContent}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
