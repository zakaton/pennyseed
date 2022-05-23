import { XCircleIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [isOnOfflinePage, setIsOnOfflinePage] = useState(null);

  const router = useRouter();
  const handleRouteChange = () => {
    setIsOnOfflinePage(
      router.pathname === '/_offline' &&
        router.asPath === window.location.pathname
    );
  };

  useEffect(() => {
    handleRouteChange();
  }, []);
  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);
  return (
    isOnOfflinePage !== null &&
    !isOnOfflinePage && (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex justify-center">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              You&apos;re offline
            </h3>
          </div>
        </div>
      </div>
    )
  );
}
