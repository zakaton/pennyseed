import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - Pennyseed</title>
      </Head>
      <div className="prose mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Terms of Service
          </span>
        </h1>
      </div>
      <div className="prose prose-lg prose-yellow mx-auto mt-6 text-gray-500">
        <h3>User Data</h3>
        <p>
          We store the following data on{' '}
          <a href="https://supabase.com/" target="_blank" rel="noreferrer">
            Supabase's database
          </a>
          :
        </p>
        <ul>
          <li>email address</li>
          <li>
            Stripe customer information (for making payments to campaigns)
          </li>
          <li>
            Stripe account information (for receiving payments for your
            campaigns)
          </li>
          <li>campaigns you've created</li>
          <li>campaigns you've pledged to</li>
        </ul>

        <p>
          You can see how we store user information{' '}
          <a
            href="https://github.com/zakaton/pennyseed"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </p>

        <p>
          We only use this information to make this site work, and we don't
          share it with any third parties
        </p>

        <h3>Deleting your Account</h3>
        <p>
          When you delete your account we delete all of this information as we
          perform the following:
        </p>
        <ul>
          <li>delete your user data stored in the database</li>
          <li>
            delete your stripe customer data (which stores card information for
            making payments)
          </li>
          <li>
            delete your stripe account data (which stores card/bank info for
            receiving payments)
          </li>
          <li>
            deletes all campaigns you've created (and cancels any pending
            campaigns). It does not refund any successful campaigns you've
            created to in the past.
          </li>
          <li>
            deletes all pledges you've created (and cancels any pledges for any
            pending campaigns). It does not refund any successful campaigns
            you've pledged to in the past.
          </li>
        </ul>
      </div>
    </>
  );
}
