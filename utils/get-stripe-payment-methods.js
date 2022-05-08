let getStripePaymentMethodsPromise;
const getStripePaymentMethods = () => {
  if (!getStripePaymentMethodsPromise) {
    console.log('fetching stripe payment methods');
    getStripePaymentMethodsPromise = fetch(
      '/api/account/get-stripe-payment-methods'
    ).then((response) => response.json());
  }
  return getStripePaymentMethodsPromise;
};

export default getStripePaymentMethods;
