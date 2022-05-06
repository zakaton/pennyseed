/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import AddCardModal from './AddCardModal';
import RemoveCardModal from './RemoveCardModal';

export default function AccountPaymentInfo() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showRemoveCardModal, setShowRemoveCardModal] = useState(false);

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
    <>
      <AddCardModal open={showAddCard} setOpen={setShowAddCard} />
      <RemoveCardModal
        open={showRemoveCardModal}
        setOpen={setShowRemoveCardModal}
      />
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white px-4 pb-1 pt-6 sm:px-6 sm:pt-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Payment Info
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add and remove payment methods.
            </p>
          </div>

          <div className="mt-5 border-t border-gray-200">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">
                  Card ending in 2142
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => setShowRemoveCardModal(true)}
                    className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-2 py-1 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    remove card
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex items-end justify-end gap-2 bg-gray-50 px-4 py-3 text-right text-xs sm:px-6 sm:text-sm">
          <button
            type="button"
            onClick={() => setShowAddCard(true)}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add card
          </button>
        </div>
      </div>
    </>
  );
}
