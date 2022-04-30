import Head from 'next/head';

function Home() {
  return (
    <div className="mt-10 px-8">
      <Head>
        <title>Pennyseed</title>
      </Head>
      <button
        type="button"
        className="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
      >
        Hello!
      </button>
      <div className="mx-auto lg:flex lg:h-auto lg:w-3/5 lg:flex-row">
        <div className="rounded-bl-md rounded-br-md bg-white p-8 lg:rounded-bl-none lg:rounded-tr-md">
          <h2 className="font-semibold text-gray-700">
            Shift overall look and fell by adding these wonderful touches to
            furniture in your home
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Ever been in a room and felt like something was missing? Perhaps it
            felt slightly bare and uninviting. I&apos;ve got some simple tips to
            help you make any room feel complete.
          </p>
          <div className="mt-8 flex items-center">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-800">
                  Michelle Appleton
                </p>
                <p className="text-sm text-gray-600">28 Jun 2020</p>
              </div>
            </div>
            <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13">
                <path
                  fill="#6E8098"
                  d="M15 6.495L8.766.014V3.88H7.441C3.33 3.88 0 7.039 0 10.936v2.049l.589-.612C2.59 10.294 5.422 9.11 8.39 9.11h.375v3.867L15 6.495z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
