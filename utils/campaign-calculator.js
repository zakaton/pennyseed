/* eslint-disable no-param-reassign */
export function truncateDollars(value, roundUp = true) {
  value = Number(value);
  value *= 100;
  value = roundUp ? Math.ceil(value) : Math.floor(value);
  value /= 100;
  return value;
}

export function dollarsToCents(dollars) {
  return Math.round(dollars * 100);
}

export const minimumCampaignDollars = 1;
export const maximumCampaignDollars = 1_000_000_000;

export const minimumPossiblePledgeDollars = 0.5;
export const maximumPossiblePledgeDollars = 999_999.99;

export const pennyseedFeePercentage = 0.01;

export const stripeFeePercentage = 0.029;
export const stripeFeeDollars = 0.3;

export function getMinimumPossibleNumberOfPledgers(fundingGoal) {
  return Math.ceil(fundingGoal / maximumPossiblePledgeDollars);
}
export function getMaximumPossibleNumberOfPledgers(fundingGoal) {
  return Math.floor(fundingGoal / minimumPossiblePledgeDollars);
}

export function getPennyseedFee(dollars) {
  dollars = truncateDollars(dollars);
  const pennyseedFee = truncateDollars(dollars * pennyseedFeePercentage);
  return pennyseedFee;
}
export function getDollarsPlusPennyseedFee(dollarsMinusFee) {
  dollarsMinusFee = truncateDollars(dollarsMinusFee);
  const dollarsPlusFee = truncateDollars(
    dollarsMinusFee + getPennyseedFee(dollarsMinusFee)
  );
  return dollarsPlusFee;
}

// https://stripe.com/pricing
export function getStripeFee(dollars) {
  dollars = truncateDollars(dollars);
  const stripeFee = truncateDollars(
    dollars * stripeFeePercentage + stripeFeeDollars
  );
  return stripeFee;
}
export function getDollarsMinusStripeFee(dollarsPlusFee) {
  dollarsPlusFee = truncateDollars(dollarsPlusFee);
  const dollarsMinusFee = truncateDollars(
    dollarsPlusFee - getStripeFee(dollarsPlusFee)
  );
  return dollarsMinusFee;
}
export function getDollarsPlusStripeFee(dollarsMinusFee) {
  dollarsMinusFee = truncateDollars(dollarsMinusFee);
  const dollarsPlusFee = truncateDollars(
    (dollarsMinusFee + stripeFeeDollars) / (1 - stripeFeePercentage)
  );
  return dollarsPlusFee;
}

export function getPledgeDollars(fundingGoal, numberOfUsers) {
  const pledgeDollars = truncateDollars(fundingGoal / numberOfUsers);
  return pledgeDollars;
}
export function getPledgeDollarsPlusFees(fundingGoal, numberOfUsers) {
  const pledgeDollars = getPledgeDollars(fundingGoal, numberOfUsers);
  let pledgeDollarsPlusFees = getDollarsPlusPennyseedFee(pledgeDollars);
  pledgeDollarsPlusFees = getDollarsPlusStripeFee(pledgeDollarsPlusFees);
  return pledgeDollarsPlusFees;
}
