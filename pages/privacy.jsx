import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Pennyseed</title>
      </Head>
      <div className="prose mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </span>
        </h1>
      </div>
      <div className="prose prose-lg prose-yellow mx-auto mt-6 text-gray-500">
        <h3>User Data</h3>
        <p>
          We store the following data on{' '}
          <a href="https://supabase.com/" target="_blank" rel="noreferrer">
            Supabase&apos;s database
          </a>
          :
        </p>
        <ul>
          <li>
            Your email address so you can sign in, as well as optionally receive
            campaign updates (which is disabled by default, you&apos;d need to
            opt-in to receive emails)
          </li>
          <li>
            Stripe customer information, so you can make payments to campaigns
          </li>
          <li>
            Stripe account information, so you can receive payments for your
            campaigns
          </li>
          <li>campaigns you&apos;ve created</li>
          <li>campaigns you&apos;ve pledged to</li>
        </ul>

        <p>
          We only use this information to make this site work, and we don&apos;t
          share it with any third parties (including people whose campaigns
          you&apos;ve pledged to, or people who pledged to your campaigns)
        </p>

        <h3>Deleting your Account</h3>
        <p>
          When you delete your account we delete all of the information listed
          above as we perform the following:
        </p>
        <ul>
          <li>
            delete your user data stored in our database, including your email
          </li>
          <li>
            delete your stripe customer data (which stores card information for
            making payments)
          </li>
          <li>
            delete your stripe account data (which stores card/bank info for
            receiving payments)
          </li>
          <li>
            deletes all campaigns you&apos;ve created (and cancels any pending
            campaigns). It does not refund any payments you&apos;ve received
            from successful campaigns you&apos;ve created in the past.
          </li>
          <li>
            deletes all pledges you&apos;ve created (and cancels any pledges for
            any pending campaigns). It does not refund any payments you&apos;ve
            made to successful campaigns you&apos;ve pledged to in the past.
          </li>
        </ul>
      </div>
    </>
  );
}
