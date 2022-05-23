import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import cardIcons from './CardIcons';
import { useUser } from '../../context/user-context';
import { numberOfMorePaymentMethodsToShow } from '../../utils/get-payment-methods';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const capitalizeString = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export default function PaymentMethodsSelect({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) {
  const {
    paymentMethods,
    getPaymentMethods,
    numberOfPaymentMethods,
    isGettingPaymentMethods,
  } = useUser();

  useEffect(() => {
    if (!paymentMethods) {
      getPaymentMethods(false, numberOfMorePaymentMethodsToShow);
    }
  }, []);

  const [pageIndex, setPageIndex] = useState(0);
  const [hasMorePaymentMethods, setHasMorePaymentMethods] = useState(false);
  useEffect(() => {
    setHasMorePaymentMethods(paymentMethods?.length !== numberOfPaymentMethods);
  }, [paymentMethods, numberOfPaymentMethods]);

  // eslint-disable-next-line no-unused-vars
  const showMorePaymentMethods = async () => {
    if (
      paymentMethods.length <=
      (pageIndex + 1) * numberOfMorePaymentMethodsToShow
    ) {
      await getPaymentMethods(false, numberOfMorePaymentMethodsToShow, true);
    }
    setPageIndex(pageIndex + 1);
  };

  let paymentMethodsContent;
  if (!paymentMethods) {
    paymentMethodsContent = (
      <Listbox.Option
        disabled
        className={classNames(
          'text-gray-900',
          'relative cursor-default select-none py-2 pl-3 pr-9'
        )}
        value=""
      >
        <div className="flex items-center">
          <span className={classNames('font-normal', 'ml-3 block truncate')}>
            loading payment methods...
          </span>
        </div>
      </Listbox.Option>
    );
  } else if (paymentMethods.length > 0) {
    paymentMethodsContent = paymentMethods.map((paymentMethod) => {
      const { brand } = paymentMethod.card;
      const capitalizedBrand = capitalizeString(brand);
      const CardIcon = cardIcons[brand] || cardIcons.default;
      return (
        <Listbox.Option
          key={paymentMethod.id}
          className={({ active }) =>
            classNames(
              active ? 'bg-yellow-600 text-white' : 'text-gray-900',
              'relative cursor-default select-none py-2 pl-3 pr-9'
            )
          }
          value={paymentMethod.id}
        >
          {({ active }) => {
            const selected = paymentMethod.id === selectedPaymentMethod?.id;
            return (
              <>
                <div className="flex items-center">
                  <span className="sr-only">{capitalizedBrand}</span>
                  {cardIcons[brand] && <CardIcon width={27} height="100%" />}
                  <span
                    className={classNames(
                      selected ? 'font-semibold' : 'font-normal',
                      'ml-3 block truncate'
                    )}
                  >
                    {brand in cardIcons
                      ? 'Ending'
                      : `${capitalizedBrand} ending`}{' '}
                    with {paymentMethod.card.last4}
                  </span>
                </div>

                {selected ? (
                  <span
                    className={classNames(
                      active ? 'text-white' : 'text-yellow-600',
                      'absolute inset-y-0 right-0 flex items-center pr-4'
                    )}
                  >
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            );
          }}
        </Listbox.Option>
      );
    });

    if (selectedPaymentMethod) {
      paymentMethodsContent.unshift(
        <Listbox.Option
          key=""
          className={({ active }) =>
            classNames(
              active ? 'bg-yellow-600 text-white' : 'text-gray-900',
              'relative cursor-default select-none py-2 pl-3 pr-9'
            )
          }
          value=""
        >
          {({ active }) => {
            const selected = !selectedPaymentMethod;
            return (
              <>
                <div className="flex items-center">
                  <span
                    className={classNames(
                      selected ? 'font-semibold' : 'font-normal',
                      'ml-3 block truncate'
                    )}
                  >
                    deselect payment method
                  </span>
                </div>

                {selected ? (
                  <span
                    className={classNames(
                      active ? 'text-white' : 'text-yellow-600',
                      'absolute inset-y-0 right-0 flex items-center pr-4'
                    )}
                  >
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            );
          }}
        </Listbox.Option>
      );
    }

    if (hasMorePaymentMethods) {
      paymentMethodsContent.push(
        <div className="flex items-center justify-center" key="get-more">
          <button
            type="button"
            className="inline-flex mx-3 my-1 w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:text-sm"
            onClick={() => showMorePaymentMethods()}
          >
            {isGettingPaymentMethods ? 'getting more...' : 'show more'}
          </button>
        </div>
      );
    }
  } else {
    paymentMethodsContent = (
      <Listbox.Option
        disabled
        className={classNames(
          'text-gray-900',
          'relative cursor-default select-none py-2 pl-3 pr-9'
        )}
        value=""
      >
        <div className="flex items-center">
          <span className={classNames('font-normal', 'ml-3 block truncate')}>
            No Payment Methods Found
          </span>
        </div>
      </Listbox.Option>
    );
  }

  let selectedPaymentMethodContent;
  if (selectedPaymentMethod) {
    const { brand } = selectedPaymentMethod.card;
    const capitalizedBrand = capitalizeString(brand);
    const CardIcon = cardIcons[brand] || cardIcons.default;
    selectedPaymentMethodContent = (
      <>
        <span className="sr-only">{capitalizedBrand}</span>
        {cardIcons[brand] && <CardIcon width={27} height="100%" />}
        <span className="ml-3 block truncate">
          {brand in cardIcons ? 'Ending' : `${capitalizedBrand} ending`} with{' '}
          {selectedPaymentMethod.card.last4}
        </span>
      </>
    );
  }

  return (
    <Listbox
      value={selectedPaymentMethod?.id || ''}
      onChange={(value) => {
        setSelectedPaymentMethod(
          paymentMethods.find((paymentMethod) => paymentMethod.id === value)
        );
      }}
    >
      {({ open }) => (
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 sm:text-sm">
            <span className="flex items-center">
              {selectedPaymentMethodContent || 'select payment method'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {paymentMethodsContent}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
