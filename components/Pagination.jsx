import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { useState, useEffect } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Pagination({
  name,
  numberOfResults,
  numberOfResultsPerPage,
  pageIndex,
  setPageIndex,
  showPrevious,
  showNext,
  isSimple,
  maxNumberOfPageButtons = 5,
}) {
  const [hasNextPage, setHasNextPage] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  useEffect(() => {
    setShowPagination(numberOfResults > 0);
    setHasNextPage(numberOfResults > (pageIndex + 1) * numberOfResultsPerPage);
  }, [numberOfResults, pageIndex]);
  useEffect(() => {
    if (
      numberOfResults !== null &&
      pageIndex * numberOfResultsPerPage >= numberOfResults
    ) {
      setPageIndex(0);
    }
  }, [numberOfResults]);

  const [numberOfPages, setNumberOfPages] = useState(0);
  useEffect(() => {
    if (
      !Number.isNaN(numberOfResults) &&
      !Number.isNaN(numberOfResultsPerPage)
    ) {
      setNumberOfPages(Math.ceil(numberOfResults / numberOfResultsPerPage));
    }
  }, [numberOfResults, numberOfResultsPerPage]);

  const pageButtons = [];
  if (!isSimple && numberOfPages > 1) {
    let includePreviousNavigation = false;
    let includeNextNavigation = false;

    let basePageButtonIndex = 1;
    let previousPageButtonsIndex = 0;
    let nextPageButtonsIndex = 0;

    const numberOfMiddlePageButtons = Math.min(
      maxNumberOfPageButtons - 2,
      numberOfPages - 2
    );
    let numberOfNumberedMiddePageButtons = numberOfMiddlePageButtons;

    if (numberOfPages > maxNumberOfPageButtons) {
      const isOnFirstPageButtons = pageIndex < numberOfMiddlePageButtons;
      if (!isOnFirstPageButtons) {
        includePreviousNavigation = true;
      }
      const isOnLastPageButtons =
        numberOfPages - pageIndex <= numberOfMiddlePageButtons;
      if (!isOnLastPageButtons) {
        includeNextNavigation = true;
      }

      if (includePreviousNavigation) {
        numberOfNumberedMiddePageButtons -= 1;
      }
      if (includeNextNavigation) {
        numberOfNumberedMiddePageButtons -= 1;
      }

      if (isOnFirstPageButtons) {
        basePageButtonIndex = 1;
      } else if (isOnLastPageButtons) {
        basePageButtonIndex = numberOfPages - numberOfMiddlePageButtons;
      } else {
        basePageButtonIndex = numberOfMiddlePageButtons;
        basePageButtonIndex += Math.floor(
          (pageIndex - basePageButtonIndex) / numberOfNumberedMiddePageButtons
        );
      }

      if (includePreviousNavigation) {
        previousPageButtonsIndex = basePageButtonIndex - 1;
      }
      if (includeNextNavigation) {
        nextPageButtonsIndex =
          basePageButtonIndex + numberOfNumberedMiddePageButtons;
      }
    }

    pageButtons.push(
      <button
        key="first"
        type="button"
        onClick={() => setPageIndex(0)}
        {...(pageIndex === 0 ? { 'aria-current': 'page' } : {})}
        className={classNames(
          'rounded-l-md',
          pageIndex === 0
            ? 'z-10 border-yellow-500 bg-yellow-50 text-yellow-600'
            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50',
          'relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium'
        )}
      >
        1
      </button>
    );
    if (includePreviousNavigation) {
      pageButtons.push(
        <button
          key="previous"
          type="button"
          className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => setPageIndex(previousPageButtonsIndex)}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      );
    }

    for (
      let pageButtonIndex = 0;
      pageButtonIndex < numberOfNumberedMiddePageButtons;
      pageButtonIndex += 1
    ) {
      const pageButtonPageIndex = basePageButtonIndex + pageButtonIndex;
      const isActive = pageButtonPageIndex === pageIndex;

      pageButtons.push(
        <button
          key={pageButtonIndex}
          type="button"
          onClick={() => setPageIndex(pageButtonPageIndex)}
          {...(isActive ? { 'aria-current': 'page' } : {})}
          className={classNames(
            isActive
              ? 'z-10 border-yellow-500 bg-yellow-50 text-yellow-600'
              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50',
            'relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium'
          )}
        >
          {pageButtonPageIndex + 1}
        </button>
      );
    }

    if (includeNextNavigation) {
      pageButtons.push(
        <button
          key="next"
          type="button"
          className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => setPageIndex(nextPageButtonsIndex)}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      );
    }

    const lastPageButtonIndex = numberOfPages - 1;
    pageButtons.push(
      <button
        key="last"
        type="button"
        onClick={() => setPageIndex(lastPageButtonIndex)}
        {...(pageIndex === 0 ? { 'aria-current': 'page' } : {})}
        className={classNames(
          'rounded-r-md',
          pageIndex === lastPageButtonIndex
            ? 'z-10 border-yellow-500 bg-yellow-50 text-yellow-600'
            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50',
          'relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium'
        )}
      >
        {numberOfPages}
      </button>
    );
  }

  return (
    showPagination && (
      <nav
        className="flex items-center justify-between border-t border-gray-200 bg-white py-3"
        aria-label="Pagination"
      >
        <div
          className={classNames(
            numberOfResults > numberOfResultsPerPage
              ? 'hidden sm:block'
              : 'block'
          )}
        >
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {pageIndex * numberOfResultsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(
                numberOfResults,
                (pageIndex + 1) * numberOfResultsPerPage
              )}
            </span>{' '}
            of <span className="font-medium">{numberOfResults}</span> {name}
            {numberOfResults === 0 ? '' : 's'}
          </p>
        </div>
        {numberOfResults > numberOfResultsPerPage && (
          <div
            className={classNames(
              isSimple ? 'sm:justify-end' : 'sm:hidden',
              'flex flex-1 justify-between'
            )}
          >
            <button
              type="button"
              onClick={showPrevious}
              className={classNames(
                pageIndex > 0 ? 'visible' : 'invisible',
                'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
              )}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={showNext}
              className={classNames(
                hasNextPage ? 'visible' : 'hidden',
                'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
              )}
            >
              Next
            </button>
          </div>
        )}
        {!isSimple && (
          <div className="relative z-0 hidden -space-x-px rounded-md shadow-sm sm:inline-flex ">
            {pageButtons}
          </div>
        )}
      </nav>
    )
  );
}
