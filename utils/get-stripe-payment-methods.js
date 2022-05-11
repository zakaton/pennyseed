export const numberOfPaymentMethodsPerPage = 5;

let getStripePaymentMethodsPromise;
const getStripePaymentMethods = (
  refresh,
  { endingBefore, startingAfter } = {}
) => {
  if (!getStripePaymentMethodsPromise || refresh) {
    console.log('fetching stripe payment methods');
    const options = {};
    if (endingBefore) {
      options.endingBefore = endingBefore;
    } else if (startingAfter) {
      options.startingAfter = startingAfter;
    }
    getStripePaymentMethodsPromise = fetch(
      `/api/account/get-stripe-payment-methods?${new URLSearchParams(options)}`
    ).then((response) => response.json());
  }
  return getStripePaymentMethodsPromise;
};

export default getStripePaymentMethods;
