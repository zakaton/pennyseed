import { Fragment, useState, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  BellIcon,
  MenuIcon,
  XIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useUser } from '../context/user-context';

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Campaign Calculator', href: '/campaign-calculator' },
];
const accountNavigation = [
  { name: 'Account', href: '/account' },
  { name: 'Sign Out', href: '/sign-out' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const router = useRouter();
  const { user, signOut } = useUser();

  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Link href="/">
                  <a className="flex flex-shrink-0 items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="hidden h-6 w-auto xxs:block"
                      src="/images/icon.svg"
                      alt="Pennyseed"
                    />
                    <span className="hidden px-2 text-xl font-bold xs:block">
                      Pennyseed
                    </span>
                  </a>
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map(({ name, href }) => (
                    <Link href={href} key={name}>
                      <a
                        className={classNames(
                          router.pathname.startsWith(href)
                            ? 'border-yellow-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'text-md inline-flex items-center border-b-2 px-1 pt-1 font-medium'
                        )}
                      >
                        {name}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!isSSR && user ? (
                  <>
                    <Menu as="div" className="relative z-10 ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                          <span className="sr-only">View notifications</span>
                          <span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full bg-red-400 ring-2 ring-white" />
                          <BellIcon className="h-8 w-8" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Notifications
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative z-10 ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <UserCircleIcon
                            className="h-8 w-8"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {accountNavigation.map(({ name, href }) => (
                            <Menu.Item key={name}>
                              {({ active }) => (
                                <a
                                  href={href}
                                  onClick={(e) => {
                                    if (name === 'Sign Out') {
                                      e.preventDefault();
                                      signOut();
                                    }
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <Link href="/sign-in">
                    <a className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700">
                      Sign in
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-4">
              {navigation.map(({ name, href }) => (
                <Disclosure.Button
                  as="a"
                  key={name}
                  href={href}
                  className={classNames(
                    router.pathname.startsWith(href)
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-transparent  text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  {name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
