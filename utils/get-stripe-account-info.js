let getStripeAccountInfoPromise;
const getStripeAccountInfo = () => {
  if (!getStripeAccountInfoPromise) {
    console.log('fetching stripe account info');
    getStripeAccountInfoPromise = fetch(
      '/api/account/get-stripe-account-info'
    ).then((response) => response.json());
  }
  return getStripeAccountInfoPromise;
};

export default getStripeAccountInfo;
