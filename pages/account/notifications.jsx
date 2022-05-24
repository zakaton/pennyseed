import Head from 'next/head';
import { getAccountLayout } from '../../components/layouts/AccountLayout';

export default function Notifications() {
  return (
    <>
      <Head>
        <title>Notifications - Pennyseed</title>
      </Head>
      <form action="#" method="POST">
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
                    id="comments"
                    name="comments"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="comments"
                    className="font-medium text-gray-700"
                  >
                    Campaign Succeeds or Fails
                  </label>
                  <p className="text-gray-500">
                    Get notified when a campaign you&apos;ve created or pledged
                    to succeeds/fails.
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="candidates"
                      name="candidates"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="candidates"
                      className="font-medium text-gray-700"
                    >
                      Day Before Campaign Deadline
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
                      id="offers"
                      name="offers"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="offers"
                      className="font-medium text-gray-700"
                    >
                      Campaign is Deleted
                    </label>
                    <p className="text-gray-500">
                      Get notified when a campaign you&apos;ve pledged to is
                      deleted by the creator.
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
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}

Notifications.getLayout = getAccountLayout;
