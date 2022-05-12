import { ExclamationIcon } from '@heroicons/react/solid';

export default function WarningBanner({ children }) {
  return (
    <div className="mb-2 rounded-md bg-orange-50 p-4">
      <div className="flex justify-center">
        <div className="flex-shrink-0">
          <ExclamationIcon
            className="h-5 w-5 text-orange-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-orange-800">{children}</h3>
        </div>
      </div>
    </div>
  );
}
