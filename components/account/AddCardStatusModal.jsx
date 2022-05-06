import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, XIcon, ExclamationIcon } from '@heroicons/react/outline';

import { useRouter } from 'next/router';
import getStripe from '../../utils/get-stripe';

const statuses = {
  succeeded: {
    icon: () => (
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
    ),
    title: 'Successfully added Card',
    message: 'Your card has been saved.',
  },
  processing: {
    icon: () => (
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
        <ExclamationIcon
          className="h-6 w-6 text-orange-600"
          aria-hidden="true"
        />
      </div>
    ),
    title: 'Processing payment details',
    message: "We'll update you when processing is complete.",
  },
  requires_payment_method: {
    icon: () => (
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <XIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
    ),
    title: 'Failed to add Card',
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
              <Dialog.Panel className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                <div>
                  <status.icon />
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {status.title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{status.message}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Back to account
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
