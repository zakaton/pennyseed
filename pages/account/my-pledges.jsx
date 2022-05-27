import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MyLink from '../../components/MyLink';
import RemovePledgeModal from '../../components/campaign/RemovePledgeModal';
import { supabase } from '../../utils/supabase';
import { useUser } from '../../context/user-context';
import { formatDollars } from '../../utils/campaign-utils';
import Notification from '../../components/Notification';
import CampaignFilters from '../../components/campaign/CampaignFilters';
import Pagination from '../../components/Pagination';
import { getAccountLayout } from '../../components/layouts/AccountLayout';
import PaymentMethodsSelect from '../../components/account/PaymentMethodsSelect';

const numberOfPledgesPerPage = 4;

const filterTypes = [
  {
    name: 'Campaign Approved',
    column: 'campaign.approved',
    query: 'approved',
    radios: [
      { value: true, label: 'approved', defaultChecked: false },
      { value: false, label: 'not approved', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
  {
    name: 'Campaign Active',
    column: 'campaign.processed',
    query: 'active',
    radios: [
      { value: false, label: 'active', defaultChecked: false },
      { value: true, label: 'ended', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
  {
    name: 'Successful',
    column: 'campaign.successful',
    query: 'successful',
    radios: [
      { value: true, label: 'successful', defaultChecked: false },
      { value: false, label: 'failed', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
];

const orderTypes = [
  {
    label: 'Date Pledged',
    query: 'date-pledged',
    value: ['created_at', { ascending: false }],
    current: true,
  },
  {
    label: 'Ending Soonest',
    query: 'ending-soonest',
    value: ['deadline', { ascending: true, foreignTable: 'campaign' }],
    current: false,
  },
  {
    label: 'Funding Goal',
    query: 'funding-goal',
    value: ['funding_goal', { ascending: false, foreignTable: 'campaign' }],
    current: false,
  },
  {
    label: 'Number of Pledgers',
    query: 'number-of-pledgers',
    value: [
      'number_of_pledgers',
      { ascending: false, foreignTable: 'campaign' },
    ],
    current: false,
  },
];

export default function MyPledges() {
  const router = useRouter();

  const { isLoading, user } = useUser();

  const [isGettingPledges, setIsGettingPledges] = useState(true);
  const [pledges, setPledges] = useState(null);
  const [filters, setFilters] = useState({});
  const [order, setOrder] = useState(orderTypes[0].value);

  const [numberOfPledges, setNumberOfPledges] = useState(null);
  const [isGettingNumberOfPledges, setIsGettingNumberOfPledges] =
    useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [previousPageIndex, setPreviousPageIndex] = useState(-1);
  const getNumberOfPledges = async () => {
    setIsGettingNumberOfPledges(true);
    // eslint-disable-next-line no-shadow
    const { error, count: numberOfPledges } = await supabase
      .from('pledge')
      .select('*, campaign!inner(*)', { count: 'exact', head: true })
      .eq('profile', user.id)
      .match(filters);
    console.log('number of pledges', numberOfPledges);
    if (error) {
      console.error(error);
    }
    setPageIndex(0);
    setNumberOfPledges(numberOfPledges);
    setIsGettingNumberOfPledges(false);
  };
  useEffect(() => {
    if (numberOfPledges !== null && !isGettingNumberOfPledges) {
      console.log('update number of pledges');
      getNumberOfPledges();
    }
  }, [filters, order]);
  useEffect(() => {
    if (!isLoading && user && numberOfPledges === null) {
      getNumberOfPledges();
    }
  }, [isLoading, user]);

  const getPledges = async (refresh) => {
    if (pageIndex !== previousPageIndex || refresh) {
      setIsGettingPledges(true);
      console.log('fetching pledges!', pageIndex);
      // eslint-disable-next-line no-shadow
      const { error, data: pledges } = await supabase
        .from('pledge')
        .select('*, campaign!inner(*)')
        .eq('profile', user.id)
        .match(filters)
        .order(...order)
        .limit(numberOfPledgesPerPage)
        .range(
          pageIndex * numberOfPledgesPerPage,
          (pageIndex + 1) * numberOfPledgesPerPage - 1
        );
      console.log('setting pledges', pledges);
      if (error) {
        console.error(error);
      }
      setPledges(pledges);
      setIsGettingPledges(false);
      setPreviousPageIndex(pageIndex);
    }
  };

  useEffect(() => {
    if (pledges && !isGettingPledges) {
      console.log('update pledges!');
      getPledges(true);
    }
  }, [filters, order]);

  useEffect(() => {
    if (!isLoading && user && numberOfPledges !== null) {
      getPledges();
    }
  }, [isLoading, numberOfPledges]);

  useEffect(() => {
    if (pledges) {
      getPledges();
    }
  }, [pageIndex]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (pledges) {
      console.log('subscribing to pledge updates');
      const subscription = supabase
        .from(`pledge:pledger=eq.${user.id}`)
        .on('INSERT', (payload) => {
          console.log('new pledge', payload);
          if (pledges.length < numberOfPledgesPerPage) {
            getPledges(true);
          }
          getNumberOfPledges();
        })
        .on('UPDATE', (payload) => {
          console.log('updated pledge', payload);
          const updatedPledge = payload.new;
          if (pledges.find((pledge) => pledge.id === updatedPledge.id)) {
            getPledges(true);
          }
        })
        .on('DELETE', (payload) => {
          console.log('deleted pledge', payload);
          const deletedPledge = payload.old;
          setPledges(
            pledges.filter((pledge) => pledge?.id !== deletedPledge.id)
          );
          getNumberOfPledges();
        })
        .subscribe();
      return () => {
        console.log('unsubscribing to pledge updates');
        supabase.removeSubscription(subscription);
      };
    }
  }, [pledges]);

  const [showRemovePledgeModal, setShowRemovePledgeModal] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState(null);
  const [removePledgeStatus, setRemovePledgeStatus] = useState('succeeded');
  const [showRemovePledgeNotification, setShowRemovePledgeNotification] =
    useState(false);

  const removeNotifications = () => {
    setShowRemovePledgeNotification(false);
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
    if ((pageIndex + 1) * numberOfPledgesPerPage < numberOfPledges) {
      setPageIndex(pageIndex + 1);
    }
  };

  const { paymentMethodsObject, getPaymentMethod } = useUser();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  useEffect(() => {
    const newFilters = { ...filters };
    if (!selectedPaymentMethod) {
      delete newFilters.payment_method;
    } else {
      newFilters.payment_method = selectedPaymentMethod.id;
    }
    setFilters(newFilters);
  }, [selectedPaymentMethod]);
  const [paymentMethodIdQuery, setPaymentMethodIdQuery] = useState(null);

  const checkQuery = () => {
    const { 'payment-method': paymentMethodId } = router.query;
    console.log('paymentMethodId', paymentMethodId);
    if (paymentMethodId) {
      setPaymentMethodIdQuery(paymentMethodId);
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

    if (selectedPaymentMethod) {
      query['payment-method'] = selectedPaymentMethod.id;
    } else {
      delete router.query['payment-method'];
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
  }, [filters, order, selectedPaymentMethod]);

  const [isFetchingPaymentMethodId, setIsFetchingPaymentMethodId] =
    useState(false);
  useEffect(() => {
    if (paymentMethodIdQuery && !isFetchingPaymentMethodId) {
      setIsFetchingPaymentMethodId(true);
      console.log('getting payment method');
      getPaymentMethod(paymentMethodIdQuery);
    }
  }, [paymentMethodIdQuery, isFetchingPaymentMethodId]);

  useEffect(() => {
    if (paymentMethodIdQuery && paymentMethodsObject[paymentMethodIdQuery]) {
      console.log(
        'got payment method',
        paymentMethodsObject[paymentMethodIdQuery]
      );
      setSelectedPaymentMethod(paymentMethodsObject[paymentMethodIdQuery]);
      setPaymentMethodIdQuery(null);
      setIsFetchingPaymentMethodId(false);
    }
  }, [paymentMethodIdQuery, paymentMethodsObject]);

  const clearFilters = () => {
    if (Object.keys(filters).length > 0) {
      setFilters({});
      setSelectedPaymentMethod(null);
    }
  };

  return (
    <>
      <Head>
        <title>My Pledges - Pennyseed</title>
      </Head>
      <RemovePledgeModal
        open={showRemovePledgeModal}
        setOpen={setShowRemovePledgeModal}
        selectedCampaign={selectedPledge?.campaign}
        setRemovePledgeStatus={setRemovePledgeStatus}
        setShowRemovePledgeNotification={setShowRemovePledgeNotification}
      />
      <Notification
        open={showRemovePledgeNotification}
        setOpen={setShowRemovePledgeNotification}
        status={removePledgeStatus}
      />
      <div className="bg-white px-4 pt-6 sm:px-6 sm:pt-6">
        <div className="flex items-center pb-4">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              My Pledges
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              View all the campaigns you&apos;ve pledged to
            </p>
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
          <fieldset id="paymentMethodId">
            <legend className="block font-medium">Payment Method</legend>
            <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
              <PaymentMethodsSelect
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
              />
            </div>
          </fieldset>
        </CampaignFilters>

        {pledges?.length > 0 &&
          pledges.map((pledge) => (
            <div
              key={pledge.id}
              className="border-t border-gray-200 px-4 py-5 sm:px-6"
            >
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Campaign Reason
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {pledge.campaign.reason}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Date Pledged
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(pledge.created_at).toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Funding Goal
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDollars(pledge.campaign.funding_goal, false)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Campaign Approved
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {pledge.campaign.approved ? 'yes' : 'no'}
                  </dd>
                </div>
                {pledge.campaign.processed && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Campaign Succeeded
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {pledge.campaign.succeeded ? 'yes' : 'no'}
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Deadline
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(pledge.campaign.deadline).toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Number of Pledgers
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {pledge.campaign.number_of_pledgers}/
                    {pledge.campaign.minimum_number_of_pledgers}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <MyLink
                    href={`/campaign/${pledge.campaign.id}`}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    View<span className="sr-only"> campaign</span>
                  </MyLink>
                </div>
                <div className="sm:col-span-1">
                  <button
                    onClick={() => {
                      setSelectedPledge(pledge);
                      setShowRemovePledgeModal(true);
                    }}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-1.5 px-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Remove<span className="sr-only"> pledge</span>
                  </button>
                </div>
              </dl>
            </div>
          ))}

        {isGettingPledges && (
          <div className="mt-5 border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-center sm:py-5">
                <div className="text-sm font-medium text-gray-500">
                  Loading pledges...
                </div>
              </div>
            </div>
          </div>
        )}

        {pledges?.length === 0 && (
          <div className="mt-5 border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-center sm:py-5">
                <div className="text-sm font-medium text-gray-500">
                  {!isGettingPledges &&
                    (user.number_of_payment_methods ? (
                      <>No pledges found.</>
                    ) : (
                      <>
                        You need to{' '}
                        <MyLink href="/account/payment-info">
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-2 py-1 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            add a payment method
                          </button>
                        </MyLink>{' '}
                        before you can pledge to a campaign.
                      </>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {pledges && pledges.length > 0 && (
          <Pagination
            name="pledge"
            numberOfResults={numberOfPledges}
            numberOfResultsPerPage={numberOfPledgesPerPage}
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

MyPledges.getLayout = getAccountLayout;
