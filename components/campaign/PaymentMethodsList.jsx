import { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import cardIcons from '../account/CardIcons';
import { useUser } from '../../context/user-context';
import { numberOfMorePaymentMethodsToShow } from '../../utils/get-payment-methods';
import MyLink from '../MyLink';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const capitalizeString = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export default function PaymentMethodsList({
  open,
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
    if (!paymentMethods && open) {
      getPaymentMethods(false, numberOfMorePaymentMethodsToShow);
    }
  }, [open]);

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

  if (paymentMethods) {
    if (paymentMethods.length > 0) {
      return (
        <>
          <RadioGroup
            value={selectedPaymentMethod?.id || ''}
            onChange={(value) => {
              setSelectedPaymentMethod(
                paymentMethods.find(
                  (paymentMethod) => paymentMethod.id === value
                )
              );
            }}
          >
            <RadioGroup.Label className="sr-only">
              Payment method
            </RadioGroup.Label>
            <div className="space-y-4">
              {paymentMethods.map((paymentMethod) => {
                const { brand } = paymentMethod.card;
                const capitalizedBrand = capitalizeString(brand);
                const CardIcon = cardIcons[brand] || cardIcons.default;
                return (
                  <RadioGroup.Option
                    key={paymentMethod.id}
                    value={paymentMethod.id}
                    className={({ checked, active }) =>
                      classNames(
                        checked ? 'border-transparent' : 'border-gray-300',
                        active
                          ? 'border-yellow-500 ring-2 ring-yellow-500'
                          : '',
                        'relative flex cursor-pointer justify-between rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none'
                      )
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <span className="flex items-center">
                          <span className="flex flex-col text-sm">
                            <RadioGroup.Label
                              as="span"
                              className="font-medium text-gray-900"
                            >
                              <h4 className="sr-only">{capitalizedBrand}</h4>
                              <div className="flex items-start">
                                <CardIcon width={42} height="100%" />
                                <div className="mt-0 ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {brand in cardIcons
                                      ? 'Ending'
                                      : `${capitalizedBrand} ending`}{' '}
                                    with {paymentMethod.card.last4}
                                  </div>
                                  <div className="mt-1 flex items-center text-sm text-gray-600">
                                    <div>
                                      Expires {paymentMethod.card.exp_month}/
                                      {paymentMethod.card.exp_year
                                        .toString()
                                        .slice(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </RadioGroup.Label>
                          </span>
                        </span>
                        <span
                          className={classNames(
                            active ? 'border' : 'border-2',
                            checked
                              ? 'border-yellow-500'
                              : 'border-transparent',
                            'pointer-events-none absolute -inset-px rounded-lg'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                );
              })}
            </div>
          </RadioGroup>
          {hasMorePaymentMethods && (
            <button
              type="button"
              className="inlint-flex mt-3 w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:text-sm"
              onClick={() => showMorePaymentMethods()}
            >
              {isGettingPaymentMethods ? 'Getting more...' : 'Show more'}
            </button>
          )}
        </>
      );
    }

    return (
      <div className="text-md min-w-fit text-center font-medium text-gray-500">
        No payment methods found. You must add one to
        <MyLink href="/account#payment-info">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-yellow-100 px-2 py-1 text-sm font-medium leading-4 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            your account
          </button>
        </MyLink>
        to pledge.
      </div>
    );
  }
  return (
    <div className="text-md text-center font-medium text-gray-500">
      Loading payment methods...
    </div>
  );
}
