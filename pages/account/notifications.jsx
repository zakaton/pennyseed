import Head from 'next/head';
import { useState } from 'react';
import { getAccountLayout } from '../../components/layouts/AccountLayout';
import { useUser } from '../../context/user-context';
import Notification from '../../components/Notification';

export default function Notifications() {
  const { user, fetchWithAccessToken } = useUser();

  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);
  const [updateNotificationsStatus, setUpdateNotificationsStatus] = useState();
  const [
    showUpdateNotificationsNotification,
    setShowUpdateNotificationsNotification,
  ] = useState(false);

  return (
    <>
      <Head>
        <title>Notifications - Pennyseed</title>
      </Head>
      <Notification
        open={showUpdateNotificationsNotification}
        setOpen={setShowUpdateNotificationsNotification}
        status={updateNotificationsStatus}
      />
      <form
        method="POST"
        action="/api/account/set-notifications"
        onSubmit={async (e) => {
          e.preventDefault();
          if (isUpdatingNotifications) {
            return;
          }
          setIsUpdatingNotifications(true);

          const form = e.target;
          const formData = new FormData(form);
          const data = new URLSearchParams();
          formData.forEach((value, key) => {
            data.append(key, value);
          });
          const response = await fetchWithAccessToken(form.action, {
            method: form.method,
            body: data,
          });
          const { status } = await response.json();
          console.log(status);
          setUpdateNotificationsStatus(status);
          setShowUpdateNotificationsNotification(true);
          setIsUpdatingNotifications(false);
        }}
      >
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get notified on campaign updates.
            </p>
          </div>

          <fieldset>
            <legend className="text-base font-medium text-gray-900">
              By Email
            </legend>
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="email_campaign_end"
                    name="email_campaign_end"
                    type="checkbox"
                    defaultChecked={user?.notifications?.includes(
                      'email_campaign_end'
                    )}
                    className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="email_campaign_end"
                    className="font-medium text-gray-700"
                  >
                    Campaign Ends
                  </label>
                  <p className="text-gray-500">
                    Get notified when a campaign you&apos;ve created or pledged
                    to ends.
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="email_campaign_end_soon"
                      name="email_campaign_end_soon"
                      type="checkbox"
                      defaultChecked={user?.notifications?.includes(
                        'email_campaign_end_soon'
                      )}
                      className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="email_campaign_end_soon"
                      className="font-medium text-gray-700"
                    >
                      Day Before Campaign Ends
                    </label>
                    <p className="text-gray-500">
                      Get notified 24 hours before a campaign you&apos;ve
                      pledged to ends.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="email_campaign_deleted"
                      name="email_campaign_deleted"
                      type="checkbox"
                      defaultChecked={user?.notifications?.includes(
                        'email_campaign_deleted'
                      )}
                      className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="email_campaign_deleted"
                      className="font-medium text-gray-700"
                    >
                      Campaign is Deleted
                    </label>
                    <p className="text-gray-500">
                      Get notified when an active campaign you&apos;ve pledged
                      to is deleted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="flex items-end justify-end gap-2 bg-gray-50 px-4 py-3 text-right text-xs sm:px-6 sm:text-sm">
          <button
            type="button"
            onClick={(e) => {
              const form = e.target.closest('form');
              form
                .querySelectorAll("input[type='checkbox']")
                .forEach((input) => {
                  // eslint-disable-next-line no-param-reassign
                  input.checked = user.notifications?.includes(input.name);
                });
            }}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
          >
            {isUpdatingNotifications ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </>
  );
}

Notifications.getLayout = getAccountLayout;
