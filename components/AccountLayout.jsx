import Head from 'next/head';
import {
  CreditCardIcon,
  KeyIcon,
  UserCircleIcon,
  UserGroupIcon,
  ViewGridAddIcon,
} from '@heroicons/react/outline';

const navigation = [
  { name: 'Account', href: '#', icon: UserCircleIcon, current: true },
  { name: 'Password', href: '#', icon: KeyIcon, current: false },
  { name: 'Plan & Billing', href: '#', icon: CreditCardIcon, current: false },
  { name: 'Team', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Integrations', href: '#', icon: ViewGridAddIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AccountLayout({ children }) {
  return (
    <>
      <Head>
        <title>Account - Pennyseed</title>
      </Head>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-gray-50 text-yellow-700 hover:bg-white hover:text-yellow-700'
                    : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? 'text-yellow-500 group-hover:text-yellow-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    '-ml-1 mr-3 h-6 w-6 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
          {children}
        </div>
      </div>
    </>
  );
}
