/* eslint-disable no-param-reassign */
export function truncateDollars(value, floor = true) {
  value = Number(value);
  value *= 100;
  value = floor ? Math.floor(value) : Math.ceil(value);
  value /= 100;
  return value;
}

export const minimumCampaignAmount = 1;
export const maximumCampaignAmount = 999_999;

export const minimumPossiblePledgeAmount = 0.5;

export function getMaximumPossibleNumberOfPledgers(fundingGoal) {
  return Math.floor(fundingGoal / minimumPossiblePledgeAmount);
}

// https://stripe.com/pricing
export function getStripeProcessingFee(dollars) {
  dollars = truncateDollars(dollars);
  const processingFee = truncateDollars(dollars * 0.029 + 0.3, false);
  return processingFee;
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
