export const numberOfPaymentMethodsPerPage = 5;
export const numberOfMorePaymentMethodsToShow = 5;
export const maxNumberOfPaymentMethods = 10;

export const fetchPaymentMethods = async (session, options = {}) => {
  console.log('fetching payment methods');
  const response = await fetch(
    `/api/account/get-payment-methods?${new URLSearchParams(options)}`,
    { headers: { 'x-supabase-auth': session.access_token } }
  );
  const { paymentMethods, status } = await response.json();
  return { paymentMethods, status };
};

export const fetchPaymentMethod = async (session, paymentMethodId) => {
  console.log('fetching payment method');
  const response = await fetch(
    `/api/account/get-payment-method?${new URLSearchParams({
      paymentMethodId,
    })}`,
    { headers: { 'x-supabase-auth': session.access_token } }
  );
  const { paymentMethod, status } = await response.json();
  return { paymentMethod, status };
};
