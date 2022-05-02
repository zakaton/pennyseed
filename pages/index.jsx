import Head from 'next/head';

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
          PennySeed is a crowdfunding platform where the funding goal is divided
          by the number of pledgers.
        </p>

        <p>
          For instance, if you ask for $1,000 and reach 500 pledgers, then each
          pays $2. However, if 1,000 people pledge, then each pays only $1.
        </p>

        <p>
          Campaigns require a deadline and a minimum number of pledgers - that
          way people know the maximum possible pledge amount (funding goal) /
          (minimum number of pledgers).
        </p>

        <p>
          You can check out our{' '}
          <a href="https://www.pennyseed.fund/campaigns/calculator">
            Campaign Calculator
          </a>{' '}
          to see how much pledgers would pay given the funding goal and number
          of pledgers
        </p>

        <p>
          Payments are done via <a href="https://stripe.com/">Stripe</a>, and
          pledge amounts include the{' '}
          <a href="https://stripe.com/pricing">Stripe processing fees</a> (2.9%
          + $0.30) so the campaigner gets exactly how much they ask for. (so
          instead of paying $1 you'll actually be paying $1.34, which will be
          $1.00 after the $0.34 processing fee)
        </p>

        <p>
          This project is hosted on <a href="https://replit.com/">Replit</a> and
          its source code is{' '}
          <a href="https://replit.com/@zakaton/Pennyseed">available here</a>.
        </p>

        <p>
          For more information check out{' '}
          <a href="https://www.pennyseed.fund/faq">faq</a>.
        </p>
      </div>
    </>
  );
}
