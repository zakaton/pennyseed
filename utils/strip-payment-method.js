export default function stripPaymentMethod(paymentMethod) {
  const {
    id,
    // eslint-disable-next-line camelcase
    card: { brand, last4, exp_month, exp_year },
  } = paymentMethod;
  return { id, card: { brand, last4, exp_month, exp_year } };
}
