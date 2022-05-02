export default function OfflineBanner() {
  return (
    <div className="relative bg-red-500">
      <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div className="px-16 pr-16 text-center">
          <p className="font-medium text-white">
            <span>You're offline</span>
          </p>
        </div>
      </div>
    </div>
  );
}
