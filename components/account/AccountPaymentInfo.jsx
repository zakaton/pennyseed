/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import AddCardModal from './AddCardModal';
import RemoveCardModal from './RemoveCardModal';
import AddCardStatusNotification from './AddCardStatusNotification';
import RemoveCardStatusNotification from './RemoveCardStatusNotification';
import getStripePaymentMethods, {
  numberOfPaymentMethodsPerPage,
} from '../../utils/get-stripe-payment-methods';
import cardIcons from './CardIcons';

const capitalizeString = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AccountPaymentInfo({ isActive }) {
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showRemoveCardModal, setShowRemoveCardModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showRemoveCardNotification, setShowRemoveCardNotification] =
    useState(false);
  const [showAddCardNotification, setShowAddCardNotification] = useState(false);

  useEffect(() => {
    if (showRemoveCardNotification) {
      setShowAddCardNotification(false);
    }
  }, [showRemoveCardNotification]);

  const removeNotifications = () => {
    setShowAddCardNotification(false);
    setShowRemoveCardNotification(false);
  };
  useEffect(() => {
    if (!isActive) {
      removeNotifications();
    }
  }, [isActive]);
  useEffect(() => {
    if (showAddCardModal || showRemoveCardModal) {
      removeNotifications();
    }
  }, [showAddCardModal, showRemoveCardModal]);

  const [removeCardStatusString, setRemoveCardStatusString] =
    useState('succeeded');

  const [stripePaymentMethods, setStripePaymentMethods] = useState(null);
  const [showPagination, setShowPagination] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const updateStripePaymentMethods = async (refresh, options) => {
    if (!options) {
      setPageIndex(0);
    }
    const data = await getStripePaymentMethods(refresh, options);
    if (options?.endingBefore) {
      data.stripePaymentMethods.push(stripePaymentMethods[0]);
    }
    setStripePaymentMethods(data.stripePaymentMethods);
  };

  useEffect(() => {
    if (!stripePaymentMethods && isActive) {
      updateStripePaymentMethods();
    }
  }, [isActive]);

  useEffect(() => {
    setShowPagination(
      stripePaymentMethods?.length === numberOfPaymentMethodsPerPage + 1 ||
        pageIndex > 0
    );
    setHasNextPage(
      stripePaymentMethods?.length === numberOfPaymentMethodsPerPage + 1
    );
  }, [stripePaymentMethods, pageIndex]);

  const showPreviousPaymentMethods = async () => {
    await updateStripePaymentMethods(true, {
      endingBefore: stripePaymentMethods[0].id,
    });
    setPageIndex(pageIndex - 1);
  };
  const showNextPaymentMethods = async () => {
    await updateStripePaymentMethods(true, {
      startingAfter: stripePaymentMethods[numberOfPaymentMethodsPerPage - 1].id,
    });
    setPageIndex(pageIndex + 1);
  };

  let paymentMethodsContent;
  if (stripePaymentMethods) {
    if (stripePaymentMethods.length > 0) {
      paymentMethodsContent = stripePaymentMethods
        .slice(0, numberOfPaymentMethodsPerPage)
        .map((paymentMethod) => {
          const { brand } = paymentMethod.card;
          const capitalizedBrand = capitalizeString(brand);
          const CardIcon = cardIcons[brand] || cardIcons.default;
          return (
            <div
              key={paymentMethod.id}
              className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5"
            >
              <h4 className="sr-only">{capitalizedBrand}</h4>
              <div className="sm:flex sm:items-start">
                <CardIcon width={42} height="100%" />
                <div className="mt-0 sm:mt-0 sm:ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {brand in cardIcons
                      ? 'Ending'
                      : `${capitalizedBrand} ending`}{' '}
                    with {paymentMethod.card.last4}
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
              onClick={() => setShowAddCardModal(true)}
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
      <AddCardModal open={showAddCardModal} setOpen={setShowAddCardModal} />
      <AddCardStatusNotification
        open={showAddCardNotification}
        setOpen={setShowAddCardNotification}
      />
      <RemoveCardModal
        open={showRemoveCardModal}
        setOpen={setShowRemoveCardModal}
        selectedPaymentMethod={selectedPaymentMethod}
        setShowRemoveCardNotification={setShowRemoveCardNotification}
        setRemoveCardStatusString={setRemoveCardStatusString}
        updateStripePaymentMethods={updateStripePaymentMethods}
      />
      <RemoveCardStatusNotification
        open={showRemoveCardNotification}
        setOpen={setShowRemoveCardNotification}
        statusString={removeCardStatusString}
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
                onClick={() => setShowAddCardModal(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add card
              </button>
            </div>
          </div>

          <div className="mt-5 border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              {paymentMethodsContent}
            </div>
          </div>
        </div>
        {showPagination && (
          <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {pageIndex * numberOfPaymentMethodsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {pageIndex * numberOfPaymentMethodsPerPage +
                    Math.min(
                      numberOfPaymentMethodsPerPage,
                      stripePaymentMethods?.length || 0
                    )}
                </span>
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
              <button
                type="button"
                onClick={showPreviousPaymentMethods}
                className={classNames(
                  pageIndex > 0 ? 'visible' : 'invisible',
                  'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                )}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={showNextPaymentMethods}
                className={classNames(
                  hasNextPage ? 'visible' : 'hidden',
                  'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                )}
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
