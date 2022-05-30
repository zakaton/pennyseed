import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MyLink from '../../components/MyLink';
import { supabase } from '../../utils/supabase';
import { useUser } from '../../context/user-context';
import Notification from '../../components/Notification';
import UserFilters from '../../components/account/UserFilters';
import Pagination from '../../components/Pagination';
import { getAccountLayout } from '../../components/layouts/AccountLayout';
import DeleteUserModal from '../../components/account/DeleteAccountModal';

const numberOfUsersPerPage = 4;

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

export default function AllUsers() {
  const router = useRouter();
  const { isLoading, user, isAdmin } = useUser();

  useEffect(() => {
    if (!isAdmin) {
      console.log('WRONG!');
      router.replace('/account', undefined, {
        shallow: true,
      });
    }
  }, []);

  const [isGettingUsers, setIsGettingUsers] = useState(true);
  const [users, setUsers] = useState(null);
  const [filters, setFilters] = useState({});
  const [order, setOrder] = useState(orderTypes[0].value);

  const [numberOfUsers, setNumberOfUsers] = useState(null);
  const [isGettingNumberOfUsers, setIsGettingNumberOfUsers] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [previousPageIndex, setPreviousPageIndex] = useState(-1);
  const getNumberOfUsers = async () => {
    setIsGettingNumberOfUsers(true);
    // eslint-disable-next-line no-shadow
    const { count: numberOfUsers } = await supabase
      .from('profile')
      .select('*', { count: 'exact', head: true })
      .match(filters);
    setPageIndex(0);
    setNumberOfUsers(numberOfUsers);
    setIsGettingNumberOfUsers(false);
  };
  useEffect(() => {
    if (numberOfUsers !== null && !isGettingNumberOfUsers) {
      console.log('update number of users');
      getNumberOfUsers();
    }
  }, [filters, order]);
  useEffect(() => {
    if (!isLoading && user && numberOfUsers === null) {
      getNumberOfUsers();
    }
  }, [isLoading, user]);

  const getUsers = async (refresh) => {
    if (pageIndex !== previousPageIndex || refresh) {
      setIsGettingUsers(true);
      console.log('fetching users!', pageIndex);
      // eslint-disable-next-line no-shadow
      const { data: users } = await supabase
        .from('profile')
        .select('*')
        .match(filters)
        .order(...order)
        .limit(numberOfUsersPerPage)
        .range(
          pageIndex * numberOfUsersPerPage,
          (pageIndex + 1) * numberOfUsersPerPage - 1
        );
      console.log('setting users', users);
      setUsers(users);
      setIsGettingUsers(false);
      setPreviousPageIndex(pageIndex);
    }
  };

  useEffect(() => {
    if (users && !isGettingUsers) {
      console.log('update users!');
      getUsers(true);
    }
  }, [filters, order]);

  useEffect(() => {
    if (!isLoading && user && numberOfUsers !== null) {
      getUsers();
    }
  }, [isLoading, numberOfUsers]);

  useEffect(() => {
    if (users) {
      getUsers();
    }
  }, [pageIndex]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (users) {
      console.log('subscribing to users updates');
      const subscription = supabase
        .from(`profile`)
        .on('INSERT', (payload) => {
          console.log('new user', payload);
          getUsers(true);
          getNumberOfUsers();
        })
        .on('UPDATE', (payload) => {
          console.log('updated user', payload);
          getUsers(true);
        })
        .on('DELETE', (payload) => {
          console.log('deleted user', payload);
          const deletedUser = payload.old;
          // eslint-disable-next-line no-shadow
          setUsers(users.filter((user) => user?.id !== deletedUser.id));
          getNumberOfUsers();
        })
        .subscribe();
      return () => {
        console.log('unsubscribing to users updates');
        supabase.removeSubscription(subscription);
      };
    }
  }, [users]);

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
    if ((pageIndex + 1) * numberOfUsersPerPage < numberOfUsers) {
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

    console.log('final query', query);
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
        <title>All Users - Pennyseed</title>
      </Head>
      <DeleteUserModal
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
              All Users
            </h3>
            <p className="mt-1 text-sm text-gray-500">View all users</p>
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

        <UserFilters
          filters={filters}
          setFilters={setFilters}
          order={order}
          setOrder={setOrder}
          filterTypes={filterTypes}
          orderTypes={orderTypes}
          clearFilters={clearFilters}
        />

        {users?.length > 0 &&
          users.map((user) => (
            <div
              key={user.id}
              className="border-t border-gray-200 px-4 py-5 sm:px-6"
            >
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
              </dl>
            </div>
          ))}

        {isGettingUsers && (
          <div className="mt-5 border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-center sm:py-5">
                <div className="text-sm font-medium text-gray-500">
                  Loading users...
                </div>
              </div>
            </div>
          </div>
        )}

        {users?.length === 0 && !isGettingUsers && (
          <div className="mt-5 border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-center sm:py-5">
                <div className="text-sm font-medium text-gray-500">
                  No users found.
                </div>
              </div>
            </div>
          </div>
        )}
        {users && users.length > 0 && (
          <Pagination
            name="campaign"
            numberOfResults={numberOfUsers}
            numberOfResultsPerPage={numberOfUsersPerPage}
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

AllUsers.getLayout = getAccountLayout;
