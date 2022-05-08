import Head from 'next/head';
import Link from 'next/link';
import { truncateDollars } from '../utils/stripe-calculator';

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
          For example, if you want to raise $1,000 and reach 1,000 pledgers,
          then each pledger pays $1. However, if 2,000 people pledge, then each
          pledger pays only $0.50 (before processing fees; more below).
        </p>

        <p>
          Campaigns require a deadline and a minimum number of pledgers; that
          way people know the maximum possible pledge amount (funding goal) /
          (minimum number of pledgers). Otherwise if you wanted to raise $1,000
          and only one person pledged before the deadline, then they&apos;d pay
          $1,000.
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
          (2.9% + $0.30), so the campaigner gets exactly how much they ask for.
          For example, if you successfully raise $1,000 with 1,000 pledgers,
          each pledger won&apos;t actually pay $1, but will pay $1.34, which is
          $1.00 after processing fees ($0.34).
        </p>

        <p>
          This project is built using{' '}
          <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
            Next.js
          </a>{' '}
          for the frontend and apis,{' '}
          <a href="https://supabase.com/" target="_blank" rel="noreferrer">
            Supabase
          </a>{' '}
          for user authentication and minimal data storage (see our{' '}
          <Link href="/privacy">privacy policy</Link> for what information we store),
          and is hosted on{' '}
          <a href="https://vercel.com/" target="_blank" rel="noreferrer">
            Vercel
          </a>
          . The source code is{' '}
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
          For more information check out <Link href="/faq">FAQ</Link>.
        </p>
      </div>
    </>
  );
}
