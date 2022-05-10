import Head from 'next/head';
import CampaignForm from '../components/CampaignForm';
import MyLink from '../components/MyLink';

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

        <p>
          Try out the Campaign Example below to see what creating a campaign is
          like
        </p>

        <CampaignForm isExample />

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
          for emailing campaign updates to users (we don&apos;t email users by
          default - they have to opt-in). The source code is{' '}
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
