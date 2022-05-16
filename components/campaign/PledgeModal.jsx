/* eslint-disable react/destructuring-assignment */
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, CreditCardIcon } from '@heroicons/react/outline';

export default function PledgeModal({
  open,
  setOpen,
  selectedCampaign,
  setPledgeStatusString,
  setShowPledgeNotification,
}) {
  const [isPledging, setIsPledging] = useState(false);
  const [didPledge, setDidPledge] = useState(false);

  useEffect(() => {
    if (open) {
      setIsPledging(false);
      setDidPledge(false);
    }
  }, [open]);

  /*

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
  */

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CreditCardIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Pledge to Campaign
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Select a payment method.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  {selectedCampaign && (
                    <form
                      method="POST"
                      action="/api/campaign/pledge-to-campaign"
                      className="py-2 sm:py-0"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setIsPledging(true);
                        const form = e.target;
                        const formData = new FormData(form);
                        const data = new URLSearchParams();
                        formData.forEach((value, key) => {
                          data.append(key, value);
                        });
                        const response = await fetch(form.action, {
                          method: form.method,
                          body: data,
                        });
                        setIsPledging(false);
                        setDidPledge(true);
                        const { status } = await response.json();
                        setPledgeStatusString(status);
                        setShowPledgeNotification(true);
                        setOpen(false);
                      }}
                    >
                      <input
                        required
                        name="campaignId"
                        type="text"
                        defaultValue={selectedCampaign.id}
                        hidden
                      />
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {isPledging
                          ? 'Pledging to Campaign...'
                          : didPledge
                          ? 'Pledged to Campaign!'
                          : 'Pledge to Campaign'}
                      </button>
                    </form>
                  )}
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
