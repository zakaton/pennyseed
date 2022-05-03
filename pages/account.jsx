import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import {
  CreditCardIcon,
  UserCircleIcon,
  BellIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import enforceAuthentication from '../utils/enforce-authentication';
import AccountPaymentInfo from '../components/account/AccountPaymentInfo';
import AccountNotifications from '../components/account/AccountNotifications';
import AccountGeneral from '../components/account/AccountGeneral';

const navigation = [
  {
    name: 'General',
    hash: '',
    icon: UserCircleIcon,
    component: AccountGeneral,
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

export const getServerSideProps = enforceAuthentication;

export default function Account() {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? 'with' : 'without'
        } shallow routing`
      );
    };

    router.events.on('hashChangeStart', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('hashChangeStart', handleRouteChange);
    };
  }, []);

  const hash = router.asPath.split('#')[1] || '';
  console.log('current hash:', hash);
  return (
    <>
      <Head>
        <title>Account - Pennyseed</title>
      </Head>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="px-2 sm:px-6 lg:col-span-2 lg:py-0 lg:px-0">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const current = hash === item.hash;
              console.log(item.hash, current);
              return (
                <Link key={item.name} href={`/account#${item.hash}`} passHref>
                  <a
                    className={classNames(
                      current
                        ? 'bg-gray-50 text-yellow-700 hover:bg-white hover:text-yellow-700'
                        : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
                    )}
                    aria-current={current ? 'page' : undefined}
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
                  </a>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
          {navigation.map((item) => {
            const current = item.hash === hash;
            return (
              <div key={item.id} hidden={!current}>
                <item.component />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
