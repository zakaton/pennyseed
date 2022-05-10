import { useState, useEffect, useLayoutEffect } from 'react';
import {
  maximumCampaignAmount,
  minimumCampaignAmount,
  getMaximumPossibleNumberOfPledgers,
  getPledgeAmountPlusProcessing,
  getAmountAfterProcessing,
} from '../utils/campaign-calculator';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CampaignForm({ isExample = false }) {
  function formatDateForInput(date) {
    return date.toISOString().slice(0, 16);
  }
  function formatDollars(dollars) {
    return dollars.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const reasonPlaceholder = 'reason';
  const maxReasonCharacterLimit = 140;
  const defaultFundingGoal = 1000;

  const [fundingGoal, setFundingGoal] = useState(defaultFundingGoal);
  const [reason, setReason] = useState(reasonPlaceholder);
  const [deadline, setDeadline] = useState('');
  const [minimumNumberOfPledgers, setMinimumNumberOfPledgers] =
    useState(defaultFundingGoal);
  const [currentNumberOfPledgers, setCurrentNumberOfPledgers] =
    useState(defaultFundingGoal);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setMinutes(
      currentDate.getMinutes() - currentDate.getTimezoneOffset() + 30
    );
    setDeadline(currentDate);
  }, []);

  const [isCampaignSuccessful, setIsCampaignSuccessful] = useState(false);
  useEffect(() => {
    setIsCampaignSuccessful(currentNumberOfPledgers >= minimumNumberOfPledgers);
  }, [currentNumberOfPledgers, minimumNumberOfPledgers]);

  const [pledgeAmount, setPledgeAmount] = useState(1);
  useEffect(() => {
    setPledgeAmount(
      isCampaignSuccessful
        ? getPledgeAmountPlusProcessing(fundingGoal, currentNumberOfPledgers)
        : 0
    );
  }, [isCampaignSuccessful]);

  const pledgeAmountAfterProcessing = isCampaignSuccessful
    ? getAmountAfterProcessing(pledgeAmount)
    : 0;
  const netPledgeAmount = isCampaignSuccessful
    ? pledgeAmountAfterProcessing * currentNumberOfPledgers
    : 0;

  const [maximumPossibleNumberOfPledgers, setMaximumPossibleNumberOfPledgers] =
    useState(defaultFundingGoal);

  useEffect(() => {
    setMaximumPossibleNumberOfPledgers(
      getMaximumPossibleNumberOfPledgers(fundingGoal)
    );
  }, [fundingGoal]);

  useLayoutEffect(() => {
    if (minimumNumberOfPledgers > maximumPossibleNumberOfPledgers) {
      setMinimumNumberOfPledgers(maximumPossibleNumberOfPledgers);
    }
    if (currentNumberOfPledgers > maximumPossibleNumberOfPledgers) {
      setCurrentNumberOfPledgers(maximumPossibleNumberOfPledgers);
    }
  }, [maximumPossibleNumberOfPledgers]);

  return (
    <div className="bg-white px-4 py-2 shadow sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-3">
        <div className="pr-2 md:col-span-1">
          <h3 className="mt-0 mb-2 text-xl font-medium leading-6 text-gray-900">
            {isExample ? 'Campaign Example' : 'Create Campaign'}
          </h3>
          <p className="text-sm italic text-gray-500">
            See how much your pledgers would pay for a given funding goal
          </p>
          <p className="mt-1 mb-3 text-sm text-gray-500">
            I am raising{' '}
            <span className="font-medium text-green-500">
              ${fundingGoal.toLocaleString()}
            </span>{' '}
            for <span className="font-bold">{reason || reasonPlaceholder}</span>
            .
          </p>
          <p className="m-0 mb-3 text-sm text-gray-500">
            This campaign requires a minimum of{' '}
            <span className="font-medium text-yellow-600">
              {minimumNumberOfPledgers.toLocaleString()}
            </span>{' '}
            {minimumNumberOfPledgers === 1 ? 'pledger' : 'pledgers'} by{' '}
            <span className="font-bold">
              {deadline && deadline.toLocaleString()}
            </span>
            .
          </p>
          <p className="m-0 mb-0 text-sm text-gray-500">
            If there {currentNumberOfPledgers === 1 ? 'is' : 'are'}{' '}
            <span className="font-medium text-yellow-600">
              {currentNumberOfPledgers > 0
                ? currentNumberOfPledgers.toLocaleString()
                : 'no'}
            </span>{' '}
            {currentNumberOfPledgers === 1 ? 'pledger' : 'pledgers'} when the
            deadline passes, then the campaign{' '}
            <span
              className={classNames(
                'font-medium',
                isCampaignSuccessful ? 'text-green-500' : 'text-red-400'
              )}
            >
              {isCampaignSuccessful ? 'succeeds' : 'fails'}
            </span>
            , and{' '}
            {isCampaignSuccessful ? (
              <>
                each pledger is charged exactly{' '}
                <span className="font-medium text-green-500">
                  ${formatDollars(pledgeAmount)}
                </span>{' '}
                (which is{' '}
                <span className="font-medium text-green-500">
                  ${formatDollars(pledgeAmountAfterProcessing)}
                </span>{' '}
                after{' '}
                <span className="font-medium">
                  <a
                    href="https://stripe.com/pricing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Stripe&apos;s processing fees
                  </a>
                </span>
                ), resulting in{' '}
                <span className="font-medium text-green-500">
                  ${formatDollars(netPledgeAmount)}
                </span>{' '}
                for me, the campaigner
              </>
            ) : (
              'nothing happens'
            )}
            .
          </p>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.target.reportValidity();
            }}
            onInput={(e) => {
              e.target.reportValidity();
            }}
          >
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="funding-goal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Funding Goal
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    required
                    type="number"
                    name="funding-goal"
                    id="funding-goal"
                    min={minimumCampaignAmount}
                    max={maximumCampaignAmount}
                    value={fundingGoal}
                    inputMode="numeric"
                    step="1"
                    onChange={(e) => {
                      setFundingGoal(Number(e.target.value));
                    }}
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    placeholder={fundingGoal}
                    aria-describedby="funding-goal-currency"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className="text-gray-500 sm:text-sm"
                      id="funding-goal-currency"
                    >
                      USD
                    </span>
                  </div>
                </div>
                <p className="my-0 mt-1 p-0 text-sm italic text-gray-400">
                  must be below ${maximumCampaignAmount.toLocaleString()}
                </p>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700"
                >
                  Deadline
                </label>
                <input
                  required
                  type="datetime-local"
                  name="deadline"
                  id="deadline"
                  value={deadline && formatDateForInput(deadline)}
                  onInput={(e) => {
                    const newDeadline = new Date(e.target.value);
                    e.target.value = formatDateForInput(newDeadline);
                    const hasDeadlinePassed =
                      newDeadline.getTime() < Date.now();
                    e.target.setCustomValidity(
                      hasDeadlinePassed ? 'deadline must be a future date' : ''
                    );
                    if (!hasDeadlinePassed) {
                      setDeadline(newDeadline);
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
                <p className="my-0 mt-1 p-0 text-sm italic text-gray-400">
                  must be a future date
                </p>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason
                </label>
                <div className="mt-1">
                  <textarea
                    required
                    rows="3"
                    name="reason"
                    id="reason"
                    maxLength={maxReasonCharacterLimit}
                    placeholder={reason}
                    onInput={(e) => setReason(e.target.value)}
                    className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                  <p className="my-0 mt-1 p-0 text-sm italic text-gray-400">
                    {reason.length}/{maxReasonCharacterLimit} characters
                    remaining
                  </p>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="minimum-number-of-pledgers"
                  className="block text-sm font-medium text-gray-700"
                >
                  Minimum Number of Pledgers
                </label>
                <input
                  required
                  type="number"
                  name="minimum-number-of-pledgers"
                  id="minimum-number-of-pledgers"
                  min="1"
                  step="1"
                  value={minimumNumberOfPledgers}
                  max={maximumPossibleNumberOfPledgers}
                  onInput={(e) =>
                    setMinimumNumberOfPledgers(Number(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
                <p className="my-0 mt-1 p-0 text-sm italic text-gray-400">
                  must be between 1 and {maximumPossibleNumberOfPledgers}
                </p>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="current-number-of-pledgers"
                  className="block text-sm font-medium text-gray-700"
                >
                  {isExample
                    ? 'Final Number of Pledgers'
                    : 'Current Number of Pledgers'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  max={fundingGoal * 2}
                  value={currentNumberOfPledgers}
                  onChange={(e) =>
                    setCurrentNumberOfPledgers(Number(e.target.value))
                  }
                  name="current-number-of-pledgers"
                  id="current-number-of-pledgers"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
