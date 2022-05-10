/* eslint-disable no-param-reassign */
export function truncateDollars(value, roundDown = true) {
  value = Number(value);
  value *= 100;
  value = roundDown ? Math.floor(value) : Math.ceil(value);
  value /= 100;
  return value;
}

export function dollarsToCents(dollars) {
  return Math.round(dollars * 100);
}

export const minimumCampaignAmount = 1;
export const maximumCampaignAmount = 1_000_000_000;

export const minimumPossiblePledgeAmount = 0.5;
export const maximumPossiblePledgeAmount = 999_999.99;
export const pennyseedFeePercentage = 0.01;

export function getMinimumPossibleNumberOfPledgers(fundingGoal) {
  return Math.ceil(fundingGoal / maximumPossiblePledgeAmount);
}
export function getMaximumPossibleNumberOfPledgers(fundingGoal) {
  return Math.floor(fundingGoal / minimumPossiblePledgeAmount);
}

// https://stripe.com/pricing
export function getStripeProcessingFee(dollars) {
  dollars = truncateDollars(dollars);
  const stripeProcessingFee = truncateDollars(dollars * 0.029 + 0.3, false);
  return stripeProcessingFee;
}
export function getPennyseedFee(dollars) {
  dollars = truncateDollars(dollars);
  const pennyseedFee = truncateDollars(dollars * pennyseedFeePercentage, false);
  return pennyseedFee;
}
export function getAmountAfterProcessing(dollarsBeforeProcessing) {
  const dollars = truncateDollars(dollarsBeforeProcessing);
  const amountAfterProcessing = truncateDollars(
    dollars - getStripeProcessingFee(dollars),
    false
  );
  return amountAfterProcessing;
}
export function getAmountBeforeProcessing(dollarsAfterProcessing) {
  const dollars = truncateDollars(dollarsAfterProcessing);
  return truncateDollars((dollars + 0.3) / (1 - 0.029), false);
}

export function getPledgeAmount(fundingGoal, numberOfUsers) {
  let pledgeAmount = fundingGoal / numberOfUsers;
  pledgeAmount = truncateDollars(pledgeAmount, false);
  return pledgeAmount;
}
export function getPledgeAmountPlusProcessing(fundingGoal, numberOfUsers) {
  return getAmountBeforeProcessing(getPledgeAmount(fundingGoal, numberOfUsers));
}
