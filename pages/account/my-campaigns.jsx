import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MyLink from '../../components/MyLink';
import DeleteCampaignModal from '../../components/campaign/DeleteCampaignModal';
import { supabase } from '../../utils/supabase';
import { useUser } from '../../context/user-context';
import { formatDollars } from '../../utils/campaign-utils';
import Notification from '../../components/Notification';
import CampaignFilters from '../../components/campaign/CampaignFilters';
import Pagination from '../../components/Pagination';
import { getAccountLayout } from '../../components/layouts/AccountLayout';

const numberOfCampaignsPerPage = 4;

const filterTypes = [
  {
    name: 'Approved',
    query: 'approved',
    column: 'approved',
    radios: [
      { value: true, label: 'approved', defaultChecked: false },
      { value: false, label: 'not approved', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
  {
    name: 'Active',
    query: 'active',
    column: 'processed',
    radios: [
      { value: false, label: 'active', defaultChecked: false },
      { value: true, label: 'ended', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
  {
    name: 'Successful',
    query: 'succeeded',
    column: 'succeeded',
    radios: [
      { value: true, label: 'successful', defaultChecked: false },
      { value: false, label: 'failed', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
];

const orderTypes = [
  {
    label: 'Date Created',
    query: 'date-pledged',
    value: ['created_at', { ascending: false }],
    current: false,
  },
  {
    label: 'Ending Soonest',
    query: 'ending-soonest',
    value: ['deadline', { ascending: true }],
    current: false,
  },
  {
    label: 'Funding Goal',
    query: 'funding-goal',
    value: ['funding_goal', { ascending: false }],
    current: false,
  },
  {
    label: 'Number of Pledgers',
    query: 'number-of-pledgers',
    value: ['number_of_pledgers', { ascending: false }],
    current: false,
  },
];

export default function MyCampaigns() {
  const router = useRouter();
  const { isLoading, user, stripeLinks } = useUser();

  const [isGettingCampaigns, setIsGettingCampaigns] = useState(true);
  const [campaigns, setCampaigns] = useState(null);
  const [filters, setFilters] = useState({});
  const [order, setOrder] = useState(orderTypes[0].value);

  const [numberOfCampaigns, setNumberOfCampaigns] = useState(null);
  const [isGettingNumberOfCampaigns, setIsGettingNumberOfCampaigns] =
    useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [previousPageIndex, setPreviousPageIndex] = useState(-1);
  const getNumberOfCampaigns = async () => {
    setIsGettingNumberOfCampaigns(true);
    // eslint-disable-next-line no-shadow
    const { count: numberOfCampaigns } = await supabase
      .from('campaign')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)
      .match(filters);
    setPageIndex(0);
    setNumberOfCampaigns(numberOfCampaigns);
    setIsGettingNumberOfCampaigns(false);
  };
  useEffect(() => {
    if (numberOfCampaigns !== null && !isGettingNumberOfCampaigns) {
      console.log('update number of campaigns');
      getNumberOfCampaigns();
    }
  }, [filters, order]);
  useEffect(() => {
    if (!isLoading && user && numberOfCampaigns === null) {
      getNumberOfCampaigns();
    }
  }, [isLoading, user]);

  const getCampaigns = async (refresh) => {
    if (pageIndex !== previousPageIndex || refresh) {
      setIsGettingCampaigns(true);
      console.log('fetching campaigns!', pageIndex);
      // eslint-disable-next-line no-shadow
      const { data: campaigns } = await supabase
        .from('campaign')
        .select('*')
        .eq('created_by', user.id)
        .match(filters)
        .order(...order)
        .limit(numberOfCampaignsPerPage)
        .range(
          pageIndex * numberOfCampaignsPerPage,
          (pageIndex + 1) * numberOfCampaignsPerPage - 1
        );
      console.log('setting campaigns', campaigns);
      setCampaigns(campaigns);
      setIsGettingCampaigns(false);
      setPreviousPageIndex(pageIndex);
    }
  };

  useEffect(() => {
    if (campaigns && !isGettingCampaigns) {
      console.log('update campaigns!');
      getCampaigns(true);
    }
  }, [filters, order]);

  useEffect(() => {
    if (!isLoading && user && numberOfCampaigns !== null) {
      getCampaigns();
    }
  }, [isLoading, numberOfCampaigns]);

  useEffect(() => {
    if (campaigns) {
      getCampaigns();
    }
  }, [pageIndex]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (campaigns) {
      console.log('subscribing to campaigns updates');
      const subscription = supabase
        .from(`campaign:created_by=eq.${user.id}`)
        .on('INSERT', (payload) => {
          console.log('new campaign', payload);
          const insertedCampaign = payload.new;
          if (campaigns.length < numberOfCampaignsPerPage) {
            setCampaigns(campaigns.concat(insertedCampaign));
          }
          getNumberOfCampaigns();
        })
        .on('UPDATE', (payload) => {
          console.log('updated campaign', payload);
          const updatedCampaign = payload.new;
          setCampaigns(
            campaigns.map((campaign) =>
              campaign.id === updatedCampaign.id ? updatedCampaign : campaign
            )
          );
        })
        .on('DELETE', (payload) => {
          console.log('deleted campaigns', payload);
          const deletedCampaign = payload.old;
          setCampaigns(
            campaigns.filter((campaign) => campaign?.id !== deletedCampaign.id)
          );
          getNumberOfCampaigns();
        })
        .subscribe();
      return () => {
        console.log('unsubscribing to campaigns updates');
        supabase.removeSubscription(subscription);
      };
    }
  }, [campaigns]);

  const [showDeleteCampaignModal, setShowDeleteCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [deleteCampaignStatus, setDeleteCampaignStatus] = useState();
  const [showDeleteCampaignNotification, setShowDeleteCampaignNotification] =
    useState(false);

  const removeNotifications = () => {
    setShowDeleteCampaignNotification(false);
  };
  useEffect(() => {
    removeNotifications();
  }, []);

  const showPrevious = async () => {
    console.log('showPrevious');
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };
  const showNext = async () => {
    console.log('showNext');
    if ((pageIndex + 1) * numberOfCampaignsPerPage < numberOfCampaigns) {
      setPageIndex(pageIndex + 1);
    }
  };

  useEffect(() => {
    const query = {};
    filterTypes.forEach((filterType) => {
      delete router.query[filterType.query];
    });
    Object.keys(filters).forEach((column) => {
      // eslint-disable-next-line no-shadow
      const filter = filterTypes.find((filter) => filter.column === column);
      if (filter) {
        query[filter.query] = filters[column];
      }
    });

    const sortOption = orderTypes.find(
      // eslint-disable-next-line no-shadow
      (sortOption) => sortOption.value === order
    );
    if (sortOption) {
      query['sort-by'] = sortOption.query;
    }

    console.log(query);
    router.replace({ query: { ...router.query, ...query } }, undefined, {
      shallow: true,
    });
  }, [filters, order]);

  const clearFilters = () => {
    if (Object.keys(filters).length > 0) {
      setFilters({});
    }
  };

  return (
    <>
      <Head>
        <title>My Campaigns - Pennyseed</title>
      </Head>
      <DeleteCampaignModal
        open={showDeleteCampaignModal}
        setOpen={setShowDeleteCampaignModal}
        selectedCampaign={selectedCampaign}
        setDeleteCampaignStatus={setDeleteCampaignStatus}
        setShowDeleteCampaignNotification={setShowDeleteCampaignNotification}
      />
      <Notification
        open={showDeleteCampaignNotification}
        setOpen={setShowDeleteCampaignNotification}
        status={deleteCampaignStatus}
      />
      <div className="bg-white px-4 pt-6 sm:px-6 sm:pt-6">
        <div className="flex items-center pb-4">
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

        <CampaignFilters
          filters={filters}
          setFilters={setFilters}
          order={order}
          setOrder={setOrder}
          filterTypes={filterTypes}
          orderTypes={orderTypes}
          clearFilters={clearFilters}
        />

        {campaigns?.length > 0 &&
          campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border-t border-gray-200 px-4 py-5 sm:px-6"
            >
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Reason</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {campaign.reason}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Date Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(campaign.created_at).toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Funding Goal
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDollars(campaign.funding_goal, false)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Approved
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {campaign.approved ? 'yes' : 'no'}
                  </dd>
                </div>
                {campaign.processed && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Succeeded
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {campaign.succeeded ? 'yes' : 'no'}
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Deadline
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(campaign.deadline).toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Number of Pledgers
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {campaign.number_of_pledgers}/
                    {campaign.minimum_number_of_pledgers}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <MyLink
                    href={`/campaign/${campaign.id}`}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    View<span className="sr-only"> campaign</span>
                  </MyLink>
                </div>
                <div className="sm:col-span-1">
                  <button
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setShowDeleteCampaignModal(true);
                    }}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-1.5 px-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete<span className="sr-only"> campaign</span>
                  </button>
                </div>
              </dl>
            </div>
          ))}

        {isGettingCampaigns && (
          <div className="border-t border-gray-200 pt-5">
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-center sm:py-5">
                <div className="text-sm font-medium text-gray-500">
                  Loading campaigns...
                </div>
              </div>
            </div>
          </div>
        )}

        {!isGettingCampaigns && campaigns?.length === 0 && (
          <div className="border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-center sm:py-5">
                <div className="text-sm font-medium text-gray-500">
                  {user.can_create_campaigns ? (
                    <>
                      No campaigns found.{' '}
                      {Object.keys(filters).length === 0 &&
                        !isGettingCampaigns && (
                          <>
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
                        )}
                    </>
                  ) : (
                    <>
                      You need to{' '}
                      <MyLink
                        href={stripeLinks.onboarding}
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
        {campaigns && campaigns.length > 0 && (
          <Pagination
            name="campaign"
            numberOfResults={numberOfCampaigns}
            numberOfResultsPerPage={numberOfCampaignsPerPage}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            showPrevious={showPrevious}
            showNext={showNext}
          />
        )}
      </div>
    </>
  );
}

MyCampaigns.getLayout = getAccountLayout;
