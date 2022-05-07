import { useState } from 'react';
import Link from 'next/link';
import DeleteCampaignModal from './DeleteCampaignModal';

const campaigns = [
  {
    title: 'Need money plox',
    goal: '$1,000',
    deadline: 'Feb 27',
    approved: 'yes',
    minimumNumberOfPledgers: 100,
    maximumNumberOfPledgers: 1000,
    currentNumberOfPledgers: 0,
    succeeded: 'yes',
  },
];
campaigns.forEach((campaign, index) => {
  // eslint-disable-next-line no-param-reassign
  campaign.id = index + 1;
});

export default function AccountCampaigns() {
  const [showDeleteCampaign, setShowDeleteCampaign] = useState(false);

  return (
    <>
      <DeleteCampaignModal
        open={showDeleteCampaign}
        setOpen={setShowDeleteCampaign}
      />
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                My Campaigns
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View all the campaigns you&apos;ve created
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link passHref href="/create-campaign">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:w-auto"
                >
                  Create Campaign
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Goal
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Deadline
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Approved
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Pledgers
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Succeeded
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">View</span>
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Delete</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {campaign.title}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {campaign.goal}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {campaign.deadline}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {campaign.approved}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {campaign.currentNumberOfPledgers}/
                            {campaign.maximumNumberOfPledgers}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {campaign.succeeded}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a
                              href="#"
                              className="inline-flex items-center rounded-md border border-transparent bg-yellow-100 px-2 py-1 text-sm font-medium leading-4 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                              View<span className="sr-only"> campaign</span>
                            </a>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => setShowDeleteCampaign(true)}
                              type="button"
                              className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-2 py-1 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete<span className="sr-only"> campaign</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
