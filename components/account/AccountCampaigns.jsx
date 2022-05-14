import { useState, useEffect } from 'react';
import MyLink from '../MyLink';
import DeleteCampaignModal from './DeleteCampaignModal';
import { supabase } from '../../utils/supabase';
import { useUser } from '../../context/user-context';
import { formatDollars } from '../../utils/campaign-utils';
import DeleteCampaignStatusNotification from './DeleteCampaignStatusNotification';

export default function AccountCampaigns({ isActive }) {
  const { isLoading, user } = useUser();

  const [isGettingCampaigns, setIsGettingCampaigns] = useState(true);
  const [campaigns, setCampaigns] = useState(null);

  const getCampaigns = async () => {
    // eslint-disable-next-line no-shadow
    const { data: campaigns } = await supabase
      .from('campaign')
      .select('*')
      .eq('created_by', user.id);
    console.log('setting campaigns', campaigns);
    setCampaigns(campaigns);
    setIsGettingCampaigns(false);
  };
  useEffect(() => {
    if (!isLoading && user) {
      getCampaigns();
    }
  }, [isLoading]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isActive && campaigns) {
      console.log('subscribing to campaigns updates');
      const subscription = supabase
        .from(`campaign:created_by=eq.${user.id}`)
        .on('UPDATE', (payload) => {
          console.log('updated campaigns', payload);
          // setCampaigns({ ...campaigns, ...payload.new });
        })
        .on('DELETE', (payload) => {
          console.log('deleted campaigns', payload);
        })
        .subscribe();
      return () => {
        console.log('unsubscribing to campaigns updates');
        supabase.removeSubscription(subscription);
      };
    }
  }, [isActive, campaigns]);

  window.s = window.s || supabase;

  const [showDeleteCampaignModal, setShowDeleteCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [deleteCampaignStatusString, setDeleteCampaignStatusString] =
    useState('succeeded');
  const [showDeleteCampaignNotification, setShowDeleteCampaignNotification] =
    useState(false);

  const removeNotifications = () => {
    setShowDeleteCampaignNotification(false);
  };
  useEffect(() => {
    if (!isActive) {
      removeNotifications();
    }
  }, [isActive]);

  return (
    <>
      <DeleteCampaignModal
        open={showDeleteCampaignModal}
        setOpen={setShowDeleteCampaignModal}
        selectedCampaign={selectedCampaign}
        setDeleteCampaignStatusString={setDeleteCampaignStatusString}
        setShowDeleteCampaignNotification={setShowDeleteCampaignNotification}
      />
      <DeleteCampaignStatusNotification
        open={showDeleteCampaignNotification}
        setOpen={setShowDeleteCampaignNotification}
        statusString={deleteCampaignStatusString}
      />
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white px-4 pt-6 sm:px-6 sm:pt-6">
          <div className="flex items-center">
            <div className="sm:flex-auto">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                My Campaigns
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View all the campaigns you&apos;ve created
              </p>
            </div>
            <div className="invisible mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <MyLink href="/create-campaign">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:w-auto"
                >
                  Create Campaign
                </button>
              </MyLink>
            </div>
          </div>

          {campaigns?.length > 0 && (
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
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
                            Pledgers
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
                            <td className="truncate whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {campaign.reason}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {formatDollars(campaign.funding_goal, false)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(campaign.deadline).toLocaleString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {campaign.approved ? 'yes' : 'no'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {campaign.number_of_pledgers}/
                              {campaign.minimum_number_of_pledgers}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <MyLink
                                href={`/campaign/${campaign.id}`}
                                className="inline-flex items-center rounded-md border border-transparent bg-yellow-100 px-2 py-1 text-sm font-medium leading-4 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                              >
                                View<span className="sr-only"> campaign</span>
                              </MyLink>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => {
                                  setSelectedCampaign(campaign);
                                  setShowDeleteCampaignModal(true);
                                }}
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
          )}

          {isGettingCampaigns && (
            <div className="mt-5 border-t border-gray-200">
              <div className="divide-y divide-gray-200">
                <div className="py-4 text-center sm:py-5">
                  <div className="text-sm font-medium text-gray-500">
                    loading campaigns...
                  </div>
                </div>
              </div>
            </div>
          )}

          {campaigns?.length === 0 && (
            <div className="mt-5 border-t border-gray-200">
              <div className="divide-y divide-gray-200">
                <div className="py-4 text-center sm:py-5">
                  <div className="text-sm font-medium text-gray-500">
                    {user.can_create_campaigns ? (
                      <>
                        No campaigns found.{' '}
                        <MyLink href="/create-campaign">
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-yellow-100 px-2 py-1 text-sm font-medium leading-4 text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                          >
                            Create a Campaign
                          </button>
                        </MyLink>{' '}
                        to get started.
                      </>
                    ) : (
                      <>
                        You need to{' '}
                        <MyLink
                          href="/api/account/stripe-onboarding"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-2 py-1 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            set up your Stripe Account
                          </button>
                        </MyLink>{' '}
                        before you can create a campaign.
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
