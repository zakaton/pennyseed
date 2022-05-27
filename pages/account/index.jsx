/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { useState } from 'react';
import { useUser } from '../../context/user-context';
import DeleteAccountModal from '../../components/account/DeleteAccountModal';
import MyLink from '../../components/MyLink';
import { getAccountLayout } from '../../components/layouts/AccountLayout';

export default function AccountGeneral() {
  const { user, isLoading } = useUser();
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  return (
    <>
      <DeleteAccountModal
        open={showDeleteAccount}
        setOpen={setShowDeleteAccount}
      />
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
              {user.is_admin && (
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Is admin?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user.is_admin ? 'yes' : 'no'}
                  </dd>
                </div>
              )}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">
                  Can create campaigns?
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {user.can_create_campaigns ? (
                    'yes'
                  ) : (
                    <>
                      no.{' '}
                      <MyLink
                        href="/api/account/stripe-onboarding"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-2 py-1 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Setup your Stripe account
                        </button>
                      </MyLink>{' '}
                      in order to create campaigns.
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
      <div className="flex items-end justify-end gap-2 bg-gray-50 px-4 py-3 text-right text-xs sm:px-6 sm:text-sm">
        <MyLink
          href={
            user.has_completed_onboarding
              ? '/api/account/stripe-dashboard'
              : '/api/account/stripe-onboarding'
          }
          target="_blank"
          rel="noreferrer"
        >
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {user.has_completed_onboarding
              ? 'Go to Stripe Dashboard'
              : 'Setup Stripe Account'}
          </button>
        </MyLink>

        <button
          type="button"
          onClick={() => setShowDeleteAccount(true)}
          className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Account
        </button>
      </div>
    </>
  );
}

AccountGeneral.getLayout = getAccountLayout;
