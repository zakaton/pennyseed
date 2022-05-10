import { Fragment, useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import {
  XIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';

import { useRouter } from 'next/router';
import getStripe from '../../utils/get-stripe';

const statuses = {
  succeeded: {
    icon: () => (
      <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
    ),
    title: 'Successfully Added Card',
    message: 'Your card has been saved.',
  },
  processing: {
    icon: () => (
      <ExclamationCircleIcon
        className="h-6 w-6 text-orange-400"
        aria-hidden="true"
      />
    ),
    title: 'Processing Payment Details',
    message: "We'll update you when processing is complete.",
  },
  requires_payment_method: {
    icon: () => (
      <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
    ),
    title: 'Failed to Add Card',
    message: 'Please try another payment method.',
  },
};

export default function AddCardStatusModal() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [statusString, setStatusString] = useState('succeeded');
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
        // https://stripe.com/docs/payments/payment-methods#payment-notification
        setStatusString(setupIntent.status);
        setOpen(true);

        const urlWithoutQuery =
          window.location.origin +
          window.location.pathname +
          window.location.hash;
        router.replace(urlWithoutQuery, undefined, { shallow: true });
      });
    }
  }, [stripe]);

  const status = statuses[statusString];

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-10 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={open}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <status.icon />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {status.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {status.message}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
