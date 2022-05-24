/* eslint-disable camelcase */
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/user-context';
import AddCardModal from '../../components/account/AddCardModal';
import RemoveCardModal from '../../components/account/RemoveCardModal';
import Notification from '../../components/Notification';
import AddCardNotification from '../../components/account/AddCardNotification';
import {
  numberOfPaymentMethodsPerPage,
  maxNumberOfPaymentMethods,
} from '../../utils/get-payment-methods';
import Pagination from '../../components/Pagination';
import MyLink from '../../components/MyLink';
import cardIcons from '../../components/account/CardIcons';
import { getAccountLayout } from '../../components/layouts/AccountLayout';

const capitalizeString = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export default function PaymentInfo() {
  const { paymentMethods, numberOfPaymentMethods, getPaymentMethods } =
    useUser();

  useEffect(() => {
    if (!paymentMethods) {
      getPaymentMethods(false, numberOfPaymentMethodsPerPage);
    }
  }, []);

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
    removeNotifications();
  }, []);
  useEffect(() => {
    if (showAddCardModal || showRemoveCardModal) {
      removeNotifications();
    }
  }, [showAddCardModal, showRemoveCardModal]);

  const [removeCardStatus, setRemoveCardStatus] = useState();

  const [pageIndex, setPageIndex] = useState(0);
  const showPreviousPaymentMethods = async () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };
  const showNextPaymentMethods = async () => {
    if (
      (pageIndex + 1) * numberOfPaymentMethodsPerPage <
      numberOfPaymentMethods
    ) {
      if (
        paymentMethods.length <=
        (pageIndex + 1) * numberOfPaymentMethodsPerPage
      ) {
        await getPaymentMethods(false, numberOfPaymentMethodsPerPage, true);
      }
      setPageIndex(pageIndex + 1);
    }
  };

  let paymentMethodsContent;
  if (paymentMethods) {
    if (numberOfPaymentMethods > 0) {
      paymentMethodsContent = paymentMethods
        .slice(
          pageIndex * numberOfPaymentMethodsPerPage,
          (pageIndex + 1) * numberOfPaymentMethodsPerPage
        )
        .map((paymentMethod) => {
          const { brand } = paymentMethod.card;
          const capitalizedBrand = capitalizeString(brand);
          const CardIcon = cardIcons[brand] || cardIcons.default;
          return (
            <div
              key={paymentMethod.id}
              className="border-t border-gray-200 px-4 py-5 sm:px-6"
            >
              <h4 className="sr-only">{capitalizedBrand}</h4>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="sm:col-span-1">
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
                </div>
                <div className="sm:col-span-1">
                  <MyLink
                    href={`/account/my-pledges?payment-method=${paymentMethod.id}`}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      View Pledges
                    </button>
                  </MyLink>
                </div>
                <div className="sm:col-span-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMethod(paymentMethod);
                      setShowRemoveCardModal(true);
                    }}
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-1.5 px-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Remove Card
                  </button>
                </div>
              </div>
            </div>
          );
        });
    } else {
      paymentMethodsContent = (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
          <div className="text-sm font-medium text-gray-500">
            No cards available
          </div>
          <div className="mt-1 text-sm font-medium text-gray-500 sm:col-span-2 sm:mt-0">
            You need to{' '}
            <button
              type="button"
              onClick={() => setShowAddCardModal(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-2 py-1 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              add a card
            </button>{' '}
            in order to pledge to campaigns
          </div>
        </div>
      );
    }
  } else {
    paymentMethodsContent = (
      <div className="py-4 text-center sm:py-5">
        <div className="text-sm font-medium text-gray-500">
          Loading payment info...
        </div>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Payment Info - Pennyseed</title>
      </Head>
      <AddCardModal open={showAddCardModal} setOpen={setShowAddCardModal} />
      <AddCardNotification
        open={showAddCardNotification}
        setOpen={setShowAddCardNotification}
      />
      <RemoveCardModal
        open={showRemoveCardModal}
        setOpen={setShowRemoveCardModal}
        selectedPaymentMethod={selectedPaymentMethod}
        setShowRemoveCardNotification={setShowRemoveCardNotification}
        setRemoveCardStatus={setRemoveCardStatus}
      />
      <Notification
        open={showRemoveCardNotification}
        setOpen={setShowRemoveCardNotification}
        status={removeCardStatus}
      />
      <div className="bg-white px-4 pb-1 pt-6 sm:px-6 sm:pt-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Payment Info
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add and remove payment methods. (max {maxNumberOfPaymentMethods})
            </p>
          </div>
          {numberOfPaymentMethods < maxNumberOfPaymentMethods && (
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={() => setShowAddCardModal(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add card
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 border-t border-gray-200">
          <div className="divide-y divide-gray-200">
            {paymentMethodsContent}
          </div>
        </div>
        <Pagination
          name="card"
          numberOfResults={numberOfPaymentMethods}
          numberOfResultsPerPage={numberOfPaymentMethodsPerPage}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          showPrevious={showPreviousPaymentMethods}
          showNext={showNextPaymentMethods}
          isSimple
        />
      </div>
    </>
  );
}

PaymentInfo.getLayout = getAccountLayout;
