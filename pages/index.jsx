import Head from 'next/head';
import MyLink from '../components/MyLink';
// import { truncateDollars } from '../utils/stripe-calculator';

export default function Home() {
  return (
    <>
      <Head>
        <title>Pennyseed</title>
      </Head>
      <div className="mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            What is Pennyseed?
          </span>
        </h1>
      </div>
      <div className="prose prose-lg prose-yellow mx-auto mt-6 text-xl text-gray-500">
        <p>
          PennySeed is a crowdfunding platform where{' '}
          <span className="font-bold">
            the funding goal is divided by the number of pledgers
          </span>
          .
        </p>

        <p>
          For example, if you want to raise $1,000 and reach 1,000 pledgers,
          then each pledger pays $1. However, if 2,000 people pledge, then each
          pledger pays only $0.50 (before processing fees; more below).
        </p>

        <p>
          Campaigns require a deadline and a minimum number of pledgers; that
          way people know the maximum possible pledge amount{' '}
          <span className="font-bold">
            (funding goal)/(minimum number of pledgers)
          </span>
          . Otherwise if you wanted to raise $1,000 and only one person pledged
          before the deadline, then they&apos;d pay $1,000.
        </p>

        <p>
          Payments are done via{' '}
          <a href="https://stripe.com/" target="_blank" rel="noreferrer">
            Stripe
          </a>
          , and pledge amounts include the{' '}
          <a href="https://stripe.com/pricing" target="_blank" rel="noreferrer">
            Stripe processing fees
          </a>{' '}
          <span className="font-bold">(2.9% + $0.30)</span>, so the campaigner
          gets exactly how much they ask for. For example, if you successfully
          raise $1,000 with 1,000 pledgers, each pledger won&apos;t actually pay
          $1, but will pay $1.34, which is $1.00 after processing fees ($0.34).
        </p>

        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Use a permanent address where you can receive mail.
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form action="#" method="POST">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      type="text"
                      name="email-address"
                      id="email-address"
                      autoComplete="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street address
                    </label>
                    <input
                      type="text"
                      name="street-address"
                      id="street-address"
                      autoComplete="street-address"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP / Postal code
                    </label>
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <p>
          This project is built using{' '}
          <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
            Next.js
          </a>{' '}
          for the frontend and api routes,{' '}
          <a href="https://supabase.com/" target="_blank" rel="noreferrer">
            Supabase
          </a>{' '}
          for user authentication and minimal data storage (see our{' '}
          <MyLink href="/privacy">privacy policy</MyLink> for what information
          we store), and is hosted on{' '}
          <a href="https://vercel.com/" target="_blank" rel="noreferrer">
            Vercel
          </a>
          . We also use{' '}
          <a href="https://stripe.com/" target="_blank" rel="noreferrer">
            Stripe
          </a>{' '}
          for payment processing and{' '}
          <a href="https://sendgrid.com/" target="_blank" rel="noreferrer">
            SendGrid
          </a>{' '}
          for emailing campaign updates to users (which we don&apos;t by default
          - users have to opt-in). The source code is{' '}
          <a
            href="https://github.com/zakaton/pennyseed"
            target="_blank"
            rel="noreferrer"
          >
            available here
          </a>
          .
        </p>

        <p>
          For more information check out <MyLink href="/faq">FAQ</MyLink>.
        </p>
      </div>
    </>
  );
}
