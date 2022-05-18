export const numberOfPaymentMethodsPerPage = 5;
export const numberOfMorePaymentMethodsToShow = 5;
export const maxNumberOfPaymentMethods = 10;

export const fetchPaymentMethods = async (options = {}) => {
  console.log('fetching payment methods');
  const response = await fetch(
    `/api/account/get-payment-methods?${new URLSearchParams(options)}`
  );
  const { paymentMethods } = await response.json();
  return paymentMethods;
};

export const fetchPaymentMethod = async (paymentMethodId) => {
  console.log('fetching payment method');
  const response = await fetch(
    `/api/account/get-payment-method?${new URLSearchParams({
      paymentMethodId,
    })}`
  );
  const { paymentMethod } = await response.json();
  return paymentMethod;
};
