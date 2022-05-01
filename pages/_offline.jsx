import Head from 'next/head';

export default function Offline() {
  return (
    <>
      <Head>
        <title>Offline | Pennyseed</title>
      </Head>

      <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                You are Offline
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Check your connection and try again
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
