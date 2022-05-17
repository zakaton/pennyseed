import { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import cardIcons from '../account/CardIcons';

import getStripePaymentMethods, {
  numberOfMorePaymentMethodsToShow,
} from '../../utils/get-stripe-payment-methods';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const capitalizeString = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export default function PaymentMethodsList({
  open,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  setHasAtLeastOnePaymentMethod,
}) {
  const [stripePaymentMethods, setStripePaymentMethods] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMorePaymentMethods, setHasMorePaymentMethods] = useState(false);
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
    setHasMorePaymentMethods(
      stripePaymentMethods?.length === numberOfMorePaymentMethodsToShow + 1
    );
  }, [stripePaymentMethods, pageIndex]);

  // eslint-disable-next-line no-unused-vars
  const showMorePaymentMethods = async () => {
    await updateStripePaymentMethods(true, {
      startingAfter:
        stripePaymentMethods[numberOfMorePaymentMethodsToShow - 1].id,
    });
    setPageIndex(pageIndex + 1);
  };

  useEffect(() => {
    if (!stripePaymentMethods && open) {
      updateStripePaymentMethods();
    }
  }, [open]);

  useEffect(() => {
    setHasAtLeastOnePaymentMethod(
      stripePaymentMethods ? stripePaymentMethods.length > 0 : false
    );
  }, [stripePaymentMethods]);

  if (stripePaymentMethods) {
    if (stripePaymentMethods.length > 0) {
      return (
        <>
          <RadioGroup
            value={selectedPaymentMethod}
            onChange={setSelectedPaymentMethod}
          >
            <RadioGroup.Label className="sr-only">
              Payment method
            </RadioGroup.Label>
            <div className="space-y-4">
              {stripePaymentMethods
                .slice(0, numberOfMorePaymentMethodsToShow)
                .map((paymentMethod) => {
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
                          'relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between'
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
          {hasMorePaymentMethods && <div>Show more</div>}
        </>
      );
    }

    return (
      <div className="text-md text-center font-medium text-gray-500">
        No payment methods found.
      </div>
    );
  }
  return (
    <div className="text-md text-center font-medium text-gray-500">
      Loading payment methods...
    </div>
  );
}
