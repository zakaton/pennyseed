import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabase';
import { useUser } from '../../context/user-context';
import Notification from '../../components/Notification';
import UserFilters from '../../components/account/UserFilters';
import Pagination from '../../components/Pagination';
import { getAccountLayout } from '../../components/layouts/AccountLayout';
import DeleteUserModal from '../../components/account/DeleteUserModal.js';
import MyLink from '../../components/MyLink';

const numberOfUsersPerPage = 4;

const filterTypes = [
  {
    name: 'Has Completed Onboarding?',
    query: 'has-completed-onboarding',
    column: 'has_completed_onboarding',
    radios: [
      { value: true, label: 'yes', defaultChecked: false },
      { value: false, label: 'no', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
  {
    name: 'Can Create Campaigns?',
    query: 'can-create-campaigns',
    column: 'can_create_campaigns',
    radios: [
      { value: true, label: 'yes', defaultChecked: false },
      { value: false, label: 'no', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
];

const orderTypes = [
  {
    label: 'Date Joined',
    query: 'date-joined',
    value: ['created_at', { ascending: false }],
    current: false,
  },
  {
    label: 'Email',
    query: 'email',
    value: ['email', { ascending: true }],
    current: false,
  },
];

export default function AllUsers() {
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

  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserStatus, setDeleteUserStatus] = useState();
  const [showDeleteUserNotification, setShowDeleteUserNotification] =
    useState(false);

  const removeNotifications = () => {
    setShowDeleteUserNotification(false);
  };
  useEffect(() => {
    removeNotifications();
  }, []);

  useEffect(() => {
    if (showDeleteUserModal) {
      removeNotifications();
    }
  }, [showDeleteUserModal]);

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
        open={showDeleteUserModal}
        setOpen={setShowDeleteUserModal}
        selectedUser={selectedUser}
        setDeleteUserStatus={setDeleteUserStatus}
        setShowDeleteUserNotification={setShowDeleteUserNotification}
      />
      <Notification
        open={showDeleteUserNotification}
        setOpen={setShowDeleteUserNotification}
        status={deleteUserStatus}
      />
      <div className="bg-white px-4 pt-6 sm:px-6 sm:pt-6">
        <div className="flex items-center pb-4">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              All Users
            </h3>
            <p className="mt-1 text-sm text-gray-500">View all users</p>
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
          // eslint-disable-next-line no-shadow
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
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Date Joined
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Has Completed Onboarding?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.has_completed_onboarding ? 'yes' : 'no'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Can Create Campaigns?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.can_create_campaigns ? 'yes' : 'no'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <MyLink
                    href={`/account/all-campaigns?created_by=${user.email}`}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Campaigns
                  </MyLink>
                </div>
                <div className="sm:col-span-1">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteUserModal(true);
                    }}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-1.5 px-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete<span className="sr-only"> user</span>
                  </button>
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
            name="user"
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
