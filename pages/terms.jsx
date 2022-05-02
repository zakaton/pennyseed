import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Use - Pennyseed</title>
      </Head>
      <div className="prose mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Terms of Use
          </span>
        </h1>
      </div>
      <div className="prose prose-lg prose-yellow mx-auto mt-6 text-gray-500">
        <h3>Your Account</h3>
        <p>By signing in you agree to the following:</p>
        <ul>
          <li>
            we can delete your account at any time, canceling (and refunding if
            applicable) any campaigns or pledges you've made in the process,
            successful or pending
          </li>
        </ul>

        <h3>Your Campaigns</h3>
        <p>
          By creating a connected Stripe Account with us you agree to the
          following:
        </p>
        <ul>
          <li>
            campaigns can only be created by valid Stripe connect accounts for
            persons 13 and over (as per{' '}
            <a
              href="https://support.stripe.com/questions/age-requirement-to-create-a-stripe-account"
              target="_blank"
              rel="noreferrer"
            >
              Stripe's age requirement
            </a>
            ) living in the United States
          </li>
          <li>
            campaigns can only be made for legal, authorized, and acceptable
            purposes
          </li>
          <li>
            we can delete your Stripe Connect Account at any time, canceling any
            campaigns you've made in the process, as well as refunding any
            successful campaigns
          </li>
          <li>
            we can approve, deny, refund, or delete any campaigns you've made at
            any time
          </li>
        </ul>

        <h3>Your Pledges</h3>
        <p>By signing in you agree to the following:</p>
        <ul>
          <li>
            we can delete your Stripe Customer Account, cancelling any pending
            pledges in the process
          </li>
          <li>we can cancel or refund any pledges you've made</li>
          <li>
            as a pledger of a successful campaign (a campaign that has passed
            the minimum number of pledgers) you agree to pay (up to and
            including) the <i>Maximum Possible Pledge Amount</i> as stated in
            the campaign (funding goal)/(minimum number of pledgers) once the
            deadline has passed
          </li>
          <li>
            all charged pledges are final - make sure you read the campaign
            description carefully to see how much you'll be paying (ranging from
            (funding goal)/(minimum number of pledgers) to $0.50 before
            processing fees), and that the campaigner can be trusted (beware of
            scams and people pretending to be others)
          </li>
        </ul>
      </div>
    </>
  );
}
