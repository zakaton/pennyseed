import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, AdjustmentsIcon } from '@heroicons/react/solid';

const filterTypes = [
  {
    name: 'Approved',
    column: 'approved',
    radios: [
      { value: true, label: 'approved', defaultChecked: false },
      { value: false, label: 'not approved', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
  {
    name: 'Active',
    column: 'processed',
    radios: [
      { value: false, label: 'active', defaultChecked: false },
      { value: true, label: 'ended', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
  {
    name: 'Successful',
    column: 'successful',
    radios: [
      { value: true, label: 'successful', defaultChecked: false },
      { value: false, label: 'failed', defaultChecked: false },
      { value: null, label: 'either', defaultChecked: true },
    ],
  },
];

const sortOptions = [
  {
    label: 'Date Created',
    value: ['created_at', { ascending: true }],
    current: true,
  },
  {
    label: 'Ending Soonest',
    value: ['deadline', { ascending: true }],
    current: false,
  },
  {
    label: 'Funding Goal',
    value: ['funding_goal', { ascending: false }],
    current: false,
  },
  {
    label: 'Number of Pledgers',
    value: ['number_of_pledgers', { ascending: false }],
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CampaignFilters({ filters, setFilters, setOrder }) {
  const [numberOfActiveFilters, setNumberOfActiveFilters] = useState(0);
  useEffect(() => {
    setNumberOfActiveFilters(Object.keys(filters).length);
  }, [filters]);

  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  const clearFilters = () => {
    if (Object.keys(filters).length > 0) {
      setFilters({});
    }
  };

  return (
    <>
      {/* Filters */}
      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative z-10 grid items-center border-t border-gray-200"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 py-4">
          <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
            <div>
              <Disclosure.Button className="group flex items-center font-medium text-gray-700">
                <AdjustmentsIcon
                  className="mr-2 h-5 w-5 flex-none text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {numberOfActiveFilters || ''} Filter
                {numberOfActiveFilters === 1 ? '' : 's'}
              </Disclosure.Button>
            </div>
            <div className="pl-6">
              <button
                onClick={clearFilters}
                type="button"
                className="text-gray-500 hover:text-gray-900"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
        <Disclosure.Panel className="border-t border-gray-200 bg-gray-50 py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
            <div className="grid auto-rows-min grid-cols-1 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6">
              {filterTypes.map((filterType) => {
                const fieldsetId = filterType.name;
                return (
                  <fieldset id={fieldsetId} key={fieldsetId}>
                    <legend className="block font-medium">
                      {filterType.name}
                    </legend>
                    <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                      {filterType.radios.map((radio, radioIndex) => {
                        const id = `${filterType.column}-${radioIndex}`;
                        const checked =
                          filterType.column in filters
                            ? filters[filterType.column] === radio.value
                            : radio.defaultChecked;
                        return (
                          <div
                            key={id}
                            className="flex items-center text-base sm:text-sm"
                          >
                            <input
                              id={id}
                              name={fieldsetId}
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-yellow-600 focus:ring-yellow-500"
                              checked={checked}
                              onChange={() => {
                                const newFilters = { ...filters };
                                if (radio.value === null) {
                                  delete newFilters[filterType.column];
                                } else {
                                  newFilters[filterType.column] = radio.value;
                                }
                                setFilters(newFilters);
                              }}
                            />
                            <label
                              htmlFor={id}
                              className="ml-3 min-w-0 flex-1 text-gray-600"
                            >
                              {radio.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </div>
        </Disclosure.Panel>
        <div className="col-start-1 row-start-1 py-4">
          <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
            <Menu as="div" className="relative inline-block">
              <div className="flex">
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option, optionIndex) => (
                      <Menu.Item key={option.label}>
                        {({ active }) => {
                          const isSelected = selectedOrderIndex === optionIndex;
                          return (
                            <button
                              onClick={() => {
                                setSelectedOrderIndex(optionIndex);
                                setOrder(option.value);
                              }}
                              type="button"
                              className={classNames(
                                isSelected
                                  ? 'font-medium text-gray-900'
                                  : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block w-full px-4 py-2 text-left text-sm'
                              )}
                            >
                              {option.label}
                            </button>
                          );
                        }}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </Disclosure>
    </>
  );
}
