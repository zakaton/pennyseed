import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  CreditCardIcon,
  BellIcon,
  UserCircleIcon,
  HandIcon,
  PencilAltIcon,
} from '@heroicons/react/outline';
import MyLink from '../components/MyLink';
import { useUser } from '../context/user-context';
import AccountPaymentInfo from '../components/account/AccountPaymentInfo';
import AccountNotifications from '../components/account/AccountNotifications';
import AccountGeneral from '../components/account/AccountGeneral';
import AccountPledges from '../components/account/AccountPledges';
import AccountCampaigns from '../components/account/AccountCampaigns';

const navigation = [
  {
    name: 'General',
    hash: '',
    icon: UserCircleIcon,
    component: AccountGeneral,
  },
  {
    name: 'My Campaigns',
    hash: 'my-campaigns',
    icon: PencilAltIcon,
    component: AccountCampaigns,
  },
  {
    name: 'My Pledges',
    hash: 'my-pledges',
    icon: HandIcon,
    component: AccountPledges,
  },
  {
    name: 'Payment Info',
    hash: 'payment-info',
    icon: CreditCardIcon,
    component: AccountPaymentInfo,
  },
  {
    name: 'Notifications',
    hash: 'notifications',
    icon: BellIcon,
    component: AccountNotifications,
  },
];

navigation.forEach((item, index) => {
  // eslint-disable-next-line no-param-reassign
  item.id = index + 1;
});

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Account() {
  const router = useRouter();
  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/sign-in');
    }
  }, [isLoading, user]);

  const [hash, setHash] = useState(router.asPath.split('#')[1] || '');
  useEffect(() => {
    const handleRouteChange = (path) => {
      const url = new URL(path, window.location.origin);
      const newHash = url.hash.replace('#', '');
      setHash(newHash);
    };

    router.events.on('hashChangeStart', handleRouteChange);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('hashChangeStart', handleRouteChange);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  return (
    !isLoading &&
    user && (
      <>
        <Head>
          <title>Account - Pennyseed</title>
        </Head>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="px-2 sm:px-6 lg:col-span-2 lg:py-0 lg:px-0">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const current = hash === item.hash;
                return (
                  <MyLink
                    key={item.name}
                    href={`/account#${item.hash}`}
                    className={classNames(
                      current
                        ? 'bg-gray-50 text-yellow-700 hover:bg-white hover:text-yellow-700'
                        : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
                    )}
                    {...(current ? { 'aria-current': 'page' } : {})}
                  >
                    <item.icon
                      className={classNames(
                        current
                          ? 'text-yellow-500 group-hover:text-yellow-500'
                          : 'text-gray-400 group-hover:text-gray-500',
                        '-ml-1 mr-3 h-6 w-6 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </MyLink>
                );
              })}
            </nav>
          </aside>

          <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
            {navigation.map((item) => {
              const isActive = item.hash === hash;
              return (
                <div key={item.id} hidden={!isActive}>
                  <div className="shadow sm:rounded-md">
                    <item.component isActive={isActive} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    )
  );
}
