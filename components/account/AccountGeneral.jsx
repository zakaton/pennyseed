/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../../context/user-context';
import DeleteAccountModal from './DeleteAccountModal';

export default function AccountGeneral({ isActive }) {
  const router = useRouter();

  const { user, isLoading } = useUser();
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const [isWaitingForStripeLink, setIsWaitingForStripeLink] = useState(false);
  console.log('waiting for link?', isWaitingForStripeLink);

  const [didFetchStripeAccountInfo, setDidFetchStripeAccountInfo] =
    useState(false);
  const [didReceiveStripeAccountInfo, setDidReceiveStripeAccountInfo] =
    useState(false);
  const [canCreateCampaigns, setCanCreateCampaigns] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(null);
  const getStripeAccountInfo = async (override) => {
    const response = await fetch('/api/get-stripe-account-info');
    const { can_create_campaigns, has_completed_onboarding } =
      await response.json();
    if (canCreateCampaigns == null || override) {
      console.log('can create campaigns?', can_create_campaigns);
      setCanCreateCampaigns(can_create_campaigns);
    }
    if (canCreateCampaigns == null || override) {
      console.log('has completed onboarding?', has_completed_onboarding);
      setHasCompletedOnboarding(has_completed_onboarding);
    }
    setDidReceiveStripeAccountInfo(true);
  };

  if (isActive && !didFetchStripeAccountInfo) {
    getStripeAccountInfo();
    setDidFetchStripeAccountInfo(true);
  }

  return (
    <>
      <DeleteAccountModal
        open={showDeleteAccount}
        setOpen={setShowDeleteAccount}
      />
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white px-4 pb-2 pt-6 sm:px-6 sm:pt-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              General Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This information is private and will not be shared with anyone
            </p>
          </div>
          {!isLoading && user && (
            <div className="mt-5 border-t border-gray-200">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user.email}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Is admin?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user.is_admin ? 'yes' : 'no'}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Can create campaigns?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {didReceiveStripeAccountInfo
                      ? canCreateCampaigns
                        ? 'yes'
                        : 'no'
                      : 'loading...'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
        <div className="flex items-end justify-end gap-2 bg-gray-50 px-4 py-3 text-right text-xs sm:px-6 sm:text-sm">
          {didReceiveStripeAccountInfo ? (
            hasCompletedOnboarding ? (
              <button
                type="button"
                onClick={async () => {
                  setIsWaitingForStripeLink(true);
                  const response = await fetch('/api/get-stripe-login-link');
                  const { stripe_login_link } = await response.json();

                  router.push(stripe_login_link);
                  // window.open(stripe_login_link, '_blank').focus();
                  // setIsWaitingForStripeLink(false);
                }}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isWaitingForStripeLink
                  ? 'Loading Stripe Dashboard...'
                  : 'Go to Stripe Dashboard'}
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  setIsWaitingForStripeLink(true);
                  const response = await fetch(
                    '/api/get-stripe-onboarding-link'
                  );
                  const { stripe_onboarding_link } = await response.json();

                  router.push(stripe_onboarding_link);
                  // window.open(stripe_onboarding_link, '_blank').focus();
                  // setIsWaitingForStripeLink(false);
                }}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isWaitingForStripeLink
                  ? 'Loading Stripe Setup...'
                  : 'Setup Stripe Account'}
              </button>
            )
          ) : (
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Loading Stripe Info...
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowDeleteAccount(true)}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}
