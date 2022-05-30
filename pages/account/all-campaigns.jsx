/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SearchIcon } from '@heroicons/react/outline';
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
    query: 'successful',
    column: 'successful',
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

export default function AllCampaigns() {
  const router = useRouter();
  const { isLoading, user, isAdmin } = useUser();

  useEffect(() => {
    if (!isAdmin) {
      console.log('redirect to /account');
      router.replace('/account', undefined, {
        shallow: true,
      });
    }
  }, []);

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
      .select('*, created_by!inner(email)', { count: 'exact', head: true })
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
        .select('*, created_by!inner(email)')
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
        .from(`campaign`)
        .on('INSERT', (payload) => {
          console.log('new campaign', payload);
          getCampaigns(true);
          getNumberOfCampaigns();
        })
        .on('UPDATE', (payload) => {
          console.log('updated campaign', payload);
          getCampaigns(true);
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

  useEffect(() => {
    if (showDeleteCampaignModal) {
      removeNotifications();
    }
  }, [showDeleteCampaignModal]);

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

  const [createdByEmail, setCreatedByEmail] = useState('');
  useEffect(() => {
    const newFilters = { ...filters };
    if (!createdByEmail) {
      delete newFilters['created_by.email'];
    } else {
      newFilters['created_by.email'] = createdByEmail;
    }
    setFilters(newFilters);
  }, [createdByEmail]);

  const checkQuery = () => {
    // eslint-disable-next-line no-shadow
    const { created_by } = router.query;
    console.log('created_by', created_by);
    if (created_by) {
      setCreatedByEmail(created_by);
    }
  };
  useEffect(() => {
    checkQuery();
  }, []);

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

    if (createdByEmail) {
      query.created_by = createdByEmail;
    } else {
      delete router.query.created_by;
    }

    const sortOption = orderTypes.find(
      // eslint-disable-next-line no-shadow
      (sortOption) => sortOption.value === order
    );
    if (sortOption) {
      query['sort-by'] = sortOption.query;
    }

    console.log('final query', query);
    router.replace({ query: { ...router.query, ...query } }, undefined, {
      shallow: true,
    });
  }, [filters, order, createdByEmail]);

  const clearFilters = () => {
    if (Object.keys(filters).length > 0) {
      setFilters({});
      setCreatedByEmail('');
    }
  };

  return (
    <>
      <Head>
        <title>All Campaigns - Pennyseed</title>
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
              All Campaigns
            </h3>
            <p className="mt-1 text-sm text-gray-500">View all campaigns</p>
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
        >
          <fieldset id="campaignerEmail">
            <legend className="block font-medium">Created By</legend>
            <div className="flex rounded-md py-3 shadow-sm">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <input
                  type="email"
                  defaultValue={createdByEmail}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setCreatedByEmail(e.target.value);
                    }
                  }}
                  className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  placeholder="created_by@example.com"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target
                    .closest('fieldset')
                    .querySelector('input');
                  setCreatedByEmail(input.value);
                }}
                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              >
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </button>
            </div>
          </fieldset>
        </CampaignFilters>

        {campaigns?.length > 0 &&
          campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border-t border-gray-200 px-4 py-5 sm:px-6"
            >
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {campaign.created_by.email}
                  </dd>
                </div>
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
                {!campaign.processed && (
                  <div className="sm:col-span-1">
                    <button
                      onClick={async () => {
                        const updateCampaignResult = await supabase
                          .from('campaign')
                          .update({ approved: !campaign.approved })
                          .eq('id', campaign.id);
                        console.log(
                          'updateCampaignResult',
                          updateCampaignResult
                        );
                      }}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-1.5 px-2.5 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      {campaign.approved ? 'Deny' : 'Approve'}
                      <span className="sr-only"> campaign</span>
                    </button>
                  </div>
                )}
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
          <div className="mt-5 border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-center sm:py-5">
                <div className="text-sm font-medium text-gray-500">
                  Loading campaigns...
                </div>
              </div>
            </div>
          </div>
        )}

        {campaigns?.length === 0 && !isGettingCampaigns && (
          <div className="mt-5 border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-center sm:py-5">
                <div className="text-sm font-medium text-gray-500">
                  No campaigns found.
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

AllCampaigns.getLayout = getAccountLayout;
