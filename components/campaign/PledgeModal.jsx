/* eslint-disable react/destructuring-assignment */
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, CreditCardIcon } from '@heroicons/react/outline';
import { useUser } from '../../context/user-context';

import MyLink from '../MyLink';

import PaymentMethodsList from './PaymentMethodsList';

export default function PledgeModal({
  open,
  setOpen,
  selectedCampaign,
  setPledgeStatusString,
  setShowPledgeNotification,
}) {
  const [isPledging, setIsPledging] = useState(false);
  const [didPledge, setDidPledge] = useState(false);

  const { paymentMethods } = useUser();

  useEffect(() => {
    if (open) {
      setIsPledging(false);
      setDidPledge(false);
    }
  }, [open]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

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
              <Dialog.Panel className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:min-w-[18.5rem] sm:max-w-lg sm:p-6 sm:align-middle">
                <form
                  method="POST"
                  action="/api/campaign/pledge-to-campaign"
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
                  {' '}
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CreditCardIcon
                        className="h-6 w-6 text-yellow-600"
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
                        <p className="mb-3 text-sm text-gray-500">
                          Select a payment method.
                        </p>
                      </div>
                    </div>
                  </div>
                  <PaymentMethodsList
                    open={open}
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                  <input
                    required
                    readOnly
                    name="paymentMethodId"
                    type="text"
                    defaultValue={selectedPaymentMethod?.id || ''}
                    className="invisible m-0 block h-0 w-0 p-0"
                  />
                  {paymentMethods?.length > 0 && (
                    <div className="style-links relative mt-4 flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          required
                          id="agreeToTermsOfUse"
                          aria-describedby="agreeToTermsOfUse-description"
                          name="agreeToTermsOfUse"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                      </div>
                      <div className="style-links ml-3 text-sm">
                        <label
                          htmlFor="agreeToTermsOfUse"
                          className="font-medium text-gray-700"
                        >
                          By pledging I agree{' '}
                        </label>
                        <span
                          id="agreeToTermsOfUse-description"
                          className="text-gray-500"
                        >
                          <span className="sr-only">By pledging I agree </span>{' '}
                          to the <MyLink href="/terms">terms of use</MyLink>
                        </span>
                      </div>
                    </div>
                  )}
                  {
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      {selectedCampaign && paymentMethods?.length > 0 && (
                        <>
                          <input
                            required
                            readOnly
                            name="campaignId"
                            type="text"
                            defaultValue={selectedCampaign.id}
                            className="hidden"
                          />
                          <button
                            type="submit"
                            onClick={(e) => {
                              const { form } = e.target;
                              const paymentMethodInput = form.querySelector(
                                "input[name='paymentMethodId']"
                              );
                              if (!selectedPaymentMethod) {
                                paymentMethodInput.setCustomValidity(
                                  'you must select a payment method to pledge'
                                );
                                paymentMethodInput.reportValidity();
                                e.preventDefault();
                              } else {
                                paymentMethodInput.setCustomValidity('');
                              }
                            }}
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            {/* eslint-disable-next-line no-nested-ternary */}
                            {isPledging
                              ? 'Pledging to Campaign...'
                              : didPledge
                              ? 'Pledged to Campaign!'
                              : 'Pledge to Campaign'}
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className="inlint-flex mt-3 w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        {paymentMethods?.length > 0 ? 'Cancel' : 'Close'}
                      </button>
                    </div>
                  }
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
