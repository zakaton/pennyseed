import { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

import {
  minimumCampaignDollars,
  maximumCampaignDollars,
  getMinimumPossibleNumberOfPledgers,
  getMaximumPossibleNumberOfPledgers,
  getDollarsMinusStripeFee,
  getPennyseedFee,
  getStripeFee,
  getPledgeDollars,
  getPledgeDollarsPlusFees,
  maximumCampaignReasonLength,
  formatDollars,
  formatDateForInput,
  defaultLocale,
  defaultMinutesAway,
} from '../../utils/campaign-utils';

import { useUser } from '../../context/user-context';
import MyLink from '../MyLink';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function CampaignForm({ props, isExample = false }) {
  const router = useRouter();

  const { isLoading, user } = useUser();
  const [canCreateCampaign, setCanCreateCampaign] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      if (!isExample && user?.can_create_campaigns && !user?.active_campaign) {
        setCanCreateCampaign(true);
      }
    }
  }, [isLoading, user]);

  const reasonPlaceholder = 'reason';
  const defaultFundingGoal = 1000;

  const [fundingGoal, setFundingGoal] = useState(defaultFundingGoal);
  const [reason, setReason] = useState(reasonPlaceholder);
  const [deadline, setDeadline] = useState(null);
  const [minimumNumberOfPledgers, setMinimumNumberOfPledgers] =
    useState(defaultFundingGoal);
  const [currentNumberOfPledgers, setCurrentNumberOfPledgers] =
    useState(defaultFundingGoal);

  useEffect(() => {
    const currentDate = new Date();
    const defaultFutureDate = new Date();
    defaultFutureDate.setMinutes(
      currentDate.getMinutes() -
        currentDate.getTimezoneOffset() +
        defaultMinutesAway
    );
    setDeadline(defaultFutureDate);
  }, []);

  const [isCampaignSuccessful, setIsCampaignSuccessful] = useState(false);
  useEffect(() => {
    setIsCampaignSuccessful(currentNumberOfPledgers >= minimumNumberOfPledgers);
  }, [currentNumberOfPledgers, minimumNumberOfPledgers]);

  const [pledgeDollars, setPledgeDollars] = useState(1);
  useEffect(() => {
    if (isCampaignSuccessful) {
      setPledgeDollars(getPledgeDollars(fundingGoal, currentNumberOfPledgers));
    }
  }, [isCampaignSuccessful, fundingGoal, currentNumberOfPledgers]);

  const [pledgeDollarsPlusFees, setPledgeDollarsPlusFees] = useState(
    getPledgeDollarsPlusFees(fundingGoal, currentNumberOfPledgers)
  );
  useEffect(() => {
    if (isCampaignSuccessful) {
      setPledgeDollarsPlusFees(
        getPledgeDollarsPlusFees(fundingGoal, currentNumberOfPledgers)
      );
    }
  }, [isCampaignSuccessful, fundingGoal, currentNumberOfPledgers]);

  const [pledgeDollarsMinusStripeFee, setPledgeDollarsMinusStripeFee] =
    useState(1);
  useEffect(() => {
    if (isCampaignSuccessful) {
      setPledgeDollarsMinusStripeFee(
        getDollarsMinusStripeFee(pledgeDollarsPlusFees)
      );
    }
  }, [pledgeDollars, isCampaignSuccessful]);

  const [pennyseedFee, setPennyseedFee] = useState(0);
  useEffect(() => {
    setPennyseedFee(getPennyseedFee(pledgeDollars));
  }, [pledgeDollars]);

  const [stripeFee, setStripeFee] = useState(0);
  useEffect(() => {
    if (isCampaignSuccessful) {
      setStripeFee(getStripeFee(pledgeDollarsPlusFees - pennyseedFee));
    }
  }, [isCampaignSuccessful, pledgeDollarsPlusFees, pennyseedFee]);

  const [netPledgeDollars, setNetPledgeDollars] = useState(1);
  useEffect(() => {
    if (isCampaignSuccessful) {
      setNetPledgeDollars(
        (pledgeDollarsMinusStripeFee - pennyseedFee) * currentNumberOfPledgers
      );
    }
  }, [
    isCampaignSuccessful,
    pledgeDollarsMinusStripeFee,
    currentNumberOfPledgers,
  ]);

  const [minimumPossibleNumberOfPledgers, setMinimumPossibleNumberOfPledgers] =
    useState(1);
  useEffect(() => {
    setMinimumPossibleNumberOfPledgers(
      getMinimumPossibleNumberOfPledgers(fundingGoal)
    );
  }, [fundingGoal]);

  const [maximumPossibleNumberOfPledgers, setMaximumPossibleNumberOfPledgers] =
    useState(defaultFundingGoal);
  useEffect(() => {
    setMaximumPossibleNumberOfPledgers(
      getMaximumPossibleNumberOfPledgers(fundingGoal)
    );
  }, [fundingGoal]);

  useIsomorphicLayoutEffect(() => {
    if (minimumNumberOfPledgers > maximumPossibleNumberOfPledgers) {
      setMinimumNumberOfPledgers(maximumPossibleNumberOfPledgers);
    } else if (minimumNumberOfPledgers < minimumPossibleNumberOfPledgers) {
      setMinimumNumberOfPledgers(minimumPossibleNumberOfPledgers);
    }

    if (currentNumberOfPledgers > maximumPossibleNumberOfPledgers) {
      setCurrentNumberOfPledgers(maximumPossibleNumberOfPledgers);
    } else if (currentNumberOfPledgers < minimumPossibleNumberOfPledgers) {
      setCurrentNumberOfPledgers(minimumPossibleNumberOfPledgers);
    }
  }, [minimumPossibleNumberOfPledgers, maximumPossibleNumberOfPledgers]);

  return (
    <div {...props} className="style-links shadow sm:rounded-lg">
      <div className="py-3 px-5 pb-5 sm:py-4 sm:pb-5 md:grid md:grid-cols-3 md:gap-3">
        <div className="pr-2 md:col-span-1">
          <h3 className="mt-0 mb-1 text-xl font-medium leading-6 text-gray-900">
            {isExample ? 'Campaign Example' : 'Create Campaign'}
          </h3>
          <p className="mb-3 text-sm italic text-gray-500">
            {canCreateCampaign
              ? 'Fill all the required fields and click "Create Campaign" below. You cannot edit your campaign after it\'s created.'
              : 'See how much your pledgers would pay for a given funding goal'}
          </p>
          <p className="mt-1 mb-3 text-sm text-gray-500">
            I am raising{' '}
            <span className="font-medium text-green-500">
              {formatDollars(fundingGoal, false)}
            </span>{' '}
            for <span className="font-bold">{reason || reasonPlaceholder}</span>
            .
          </p>
          <p className="m-0 mb-3 text-sm text-gray-500">
            This campaign requires a minimum of{' '}
            <span className="font-bold ">
              {minimumNumberOfPledgers.toLocaleString(defaultLocale)}
            </span>{' '}
            {minimumNumberOfPledgers === 1 ? 'pledger' : 'pledgers'} by{' '}
            <span className="font-bold">
              {deadline && deadline.toLocaleString()}
            </span>
            .
          </p>
          <p className="m-0 mb-3 text-sm text-gray-500">
            If there {currentNumberOfPledgers === 1 ? 'is' : 'are'}{' '}
            <span className="font-bold">
              {currentNumberOfPledgers > 0
                ? currentNumberOfPledgers.toLocaleString(defaultLocale)
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
                  {formatDollars(pledgeDollarsPlusFees)}
                </span>
              </>
            ) : (
              'nothing happens'
            )}
            .
          </p>

          {isCampaignSuccessful && (
            <p className="m-0 mb-0 text-sm text-gray-500">
              This pledge amount results in{' '}
              <span className="font-medium text-green-500">
                {formatDollars(pledgeDollarsMinusStripeFee - pennyseedFee)}
              </span>{' '}
              after{' '}
              <span className="font-medium">
                <a
                  href="https://stripe.com/pricing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Stripe&apos;s processing fees
                </a>{' '}
                <span className="red font-medium text-red-500">
                  ({formatDollars(stripeFee)})
                </span>
              </span>{' '}
              and Pennyseed&apos;s 1% fee{' '}
              <span className="font-medium text-red-500">
                ({formatDollars(pennyseedFee)})
              </span>
              , adding up to{' '}
              <span className="font-medium text-green-500">
                {formatDollars(netPledgeDollars)}
              </span>{' '}
              for me, the campaigner
            </p>
          )}
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form
            method="POST"
            action="/api/campaign/create-campaign"
            id="createCampaignForm"
            onSubmit={async (e) => {
              e.preventDefault();
              const isValid = e.target.reportValidity();
              if (isValid) {
                const form = e.target;
                const formData = new FormData(form);
                const data = new URLSearchParams();
                formData.forEach((value, key) => {
                  data.append(key, value);
                });
                const response = await fetch(form.action, {
                  method: form.method,
                  body: data,
                });
                const { campaignId, error } = await response.json();
                if (!error) {
                  router.push(`/campaign/${campaignId}`);
                } else {
                  console.log(error);
                }
              }
            }}
            onInput={(e) => {
              e.target.reportValidity();
            }}
          >
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="fundingGoal"
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
                    name="fundingGoal"
                    id="fundingGoal"
                    min={minimumCampaignDollars}
                    max={maximumCampaignDollars}
                    value={fundingGoal}
                    inputMode="numeric"
                    step="1"
                    onChange={(e) => {
                      setFundingGoal(Number(e.target.value));
                    }}
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    placeholder={fundingGoal}
                    aria-describedby="fundingGoal-currency"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className="text-gray-500 sm:text-sm"
                      id="fundingGoal-currency"
                    >
                      USD
                    </span>
                  </div>
                </div>
                <p className="my-0 mt-1 p-0 text-sm italic text-gray-400">
                  must be below {formatDollars(maximumCampaignDollars, false)}
                </p>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="deadline-local"
                  className="block text-sm font-medium text-gray-700"
                >
                  Deadline
                </label>
                <input
                  required
                  type="datetime-local"
                  name="deadline-local"
                  id="deadline-local"
                  value={deadline ? formatDateForInput(deadline) : ''}
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
                <input
                  required
                  readOnly
                  name="deadline"
                  id="deadline"
                  value={
                    deadline
                      ? deadline.getTime() +
                        deadline.getTimezoneOffset() * 60 * 1000
                      : ''
                  }
                  className="hidden"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason
                </label>
                <div className="mt-1">
                  <input
                    required
                    type="text"
                    name="reason"
                    id="reason"
                    maxLength={maximumCampaignReasonLength}
                    placeholder={reason}
                    onInput={(e) => setReason(e.target.value)}
                    className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                  <p className="my-0 mt-1 p-0 text-sm italic text-gray-400">
                    {reason.length}/{maximumCampaignReasonLength} characters
                    remaining
                  </p>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="minimumNumberOfPledgers"
                  className="block text-sm font-medium text-gray-700"
                >
                  Minimum Number of Pledgers
                </label>
                <input
                  required
                  type="number"
                  inputMode="numeric"
                  name="minimumNumberOfPledgers"
                  id="minimumNumberOfPledgers"
                  step="1"
                  value={minimumNumberOfPledgers}
                  min={minimumPossibleNumberOfPledgers}
                  max={maximumPossibleNumberOfPledgers}
                  onInput={(e) =>
                    setMinimumNumberOfPledgers(Number(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
                <p className="my-0 mt-1 p-0 text-sm italic text-gray-400">
                  must be between{' '}
                  {minimumPossibleNumberOfPledgers.toLocaleString(
                    defaultLocale
                  )}{' '}
                  and{' '}
                  {maximumPossibleNumberOfPledgers.toLocaleString(
                    defaultLocale
                  )}
                </p>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="current-number-of-pledgers"
                  className="block text-sm font-medium text-gray-700"
                >
                  {isExample
                    ? 'Final Number of Pledgers'
                    : 'Hypothetical Final Number of Pledgers'}
                </label>
                <input
                  type="number"
                  inputMode="numeric"
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
                <p className="my-0 mt-1 p-0 text-sm italic text-gray-400">
                  must be below{' '}
                  {maximumPossibleNumberOfPledgers.toLocaleString(
                    defaultLocale
                  )}
                </p>
              </div>

              {canCreateCampaign && (
                <div className="col-span-6">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        required
                        id="agreeToTermsOfUse"
                        aria-describedby="agreeToTermsOfUse-description"
                        name="agreeToTermsOfUse"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="agreeToTermsOfUse"
                        className="font-medium text-gray-700"
                      >
                        I agree{' '}
                      </label>
                      <span
                        id="agreeToTermsOfUse-description"
                        className="text-gray-500"
                      >
                        <span className="sr-only">I agree </span> to the{' '}
                        <MyLink href="/terms">terms of use</MyLink>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      {canCreateCampaign && (
        <div className="mt-1 flex items-end justify-end gap-2 bg-gray-50 px-4 py-3 text-right text-xs sm:px-6 sm:text-sm">
          <button
            type="submit"
            form="createCampaignForm"
            className="inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Create Campaign
          </button>
        </div>
      )}
    </div>
  );
}
