let getStripePaymentMethodsPromise;
const getStripePaymentMethods = (refresh) => {
  if (!getStripePaymentMethodsPromise || refresh) {
    console.log('fetching stripe payment methods');
    getStripePaymentMethodsPromise = fetch(
      '/api/account/get-stripe-payment-methods'
    ).then((response) => response.json());
  }
  return getStripePaymentMethodsPromise;
};

export default getStripePaymentMethods;
