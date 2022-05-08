/* eslint-disable no-param-reassign */
export function truncateDollars(value, floor = true) {
  value = Number(value);
  value *= 100;
  value = floor ? Math.floor(value) : Math.ceil(value);
  value /= 100;
  return value;
}

// https://stripe.com/pricing
export function getProcessingFee(dollars) {
  dollars = Number(dollars);
  return truncateDollars(dollars * 0.029 + 0.3, false);
}
export function getAmountAfterProcessing(dollars) {
  dollars = Number(dollars);
  return truncateDollars(dollars - getProcessingFee(dollars));
}
export function getAmountBeforeProcessing(dollars) {
  dollars = Number(dollars);
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

export const minimumPossiblePledgeAmount = 0.5;
export function getMaximumPossibleNumberOfPledgers(fundingGoal) {
  return Math.floor(fundingGoal / minimumPossiblePledgeAmount);
}
export const maximumPossiblePledgeAmount = 999_999.99;
export function getMinimumPossibleNumberOfPledgers(fundingGoal) {
  return Math.ceil(fundingGoal / maximumPossiblePledgeAmount);
}
