import { useState } from 'react';
import UnpledgeModal from './UnpledgeModal';
import MyLink from '../MyLink';

const campaigns = [
  {
    reason: 'Need money plox',
    goal: '$1,000',
    deadline: 'Feb 27',
    approved: 'yes',
    minimumNumberOfPledgers: 100,
    maximumNumberOfPledgers: 1000,
    currentNumberOfPledgers: 0,
    card: '1234',
    succeeded: 'yes',
  },
  {
    reason: 'Need money plox',
    goal: '$1,000',
    deadline: 'Feb 27',
    approved: 'yes',
    minimumNumberOfPledgers: 100,
    maximumNumberOfPledgers: 1000,
    currentNumberOfPledgers: 0,
    card: '1234',
    succeeded: 'yes',
  },
];
campaigns.forEach((campaign, index) => {
  // eslint-disable-next-line no-param-reassign
  campaign.id = index + 1;
});

export default function AccountCampaigns() {
  const [showUnpledge, setShowUnpledge] = useState(false);

  return (
    <>
      <UnpledgeModal open={showUnpledge} setOpen={setShowUnpledge} />
      <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              My Pledges
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              View all the campaigns you&apos;ve pledged to
            </p>
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
                        Reason
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
                        Card
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
                        <span className="sr-only">Unpledge</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {campaign.reason}
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
                          {campaign.card}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {campaign.currentNumberOfPledgers}/
                          {campaign.maximumNumberOfPledgers}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {campaign.succeeded}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <MyLink
                            href="#"
                            className="inline-flex items-center rounded-md border border-transparent bg-yellow-100 px-2 py-1 text-sm font-medium leading-4 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                          >
                            View<span className="sr-only"> campaign</span>
                          </MyLink>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            onClick={() => setShowUnpledge(true)}
                            className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-2 py-1 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Unpledge
                            <span className="sr-only"> to campaign</span>
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
    </>
  );
}
