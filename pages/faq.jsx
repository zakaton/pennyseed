import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Head from 'next/head';

const faqs = [
  {
    id: 1,
    question: 'Can anyone make a campaign?',
    answer: () => (
      <p>
        This is an experiment and is limited to people in the United States. Any
        campaigns you create must be approved by us before the deadline for any
        charges to occcur.
      </p>
    ),
  },
  {
    id: 2,
    question: 'Can I edit my campaign after I create one?',
    answer: () => (
      <>
        <p>
          After you create a campaign, you cannot edit it, including the title,
          description, funding goal, min/max number of pledgers, and the
          deadline. This is to ensure the pledgers know what they're going to
          pay and when.
        </p>
        <p>
          For instance, if you want to raise $1,000 with a minimum of 1,000
          pledgers, each will pay at most $1 before processing. If you changed
          the minimum number of pledgers to 100 after people have pledged then
          they'll be paying at most $10 which wouldn't be fair.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question:
      "What if someone creates a campaign for $1,000 and I'm the only pledger? I don't wanna end up paying $1,000!",
    answer: () => (
      <>
        <p>
          All campaigns require a <u>minimum number of pledgers</u> that ensures
          a maximum possible pledge amount will be paid.
        </p>
        <p>
          For instance, a minimum number of 100 pledgers ensures that if less
          than 100 people pledge then no one will pay anything. However if 100
          people pledge then each will pay $10, which is the most they'll ever
          pay. Any more than that will be less than $10 (e.g. if 200 pledge then
          each pays $5, if 500 then $2, and if 1,000 then $1)
        </p>
      </>
    ),
  },
  {
    id: 4,
    question: 'How much of the campaign funding goal does Pennyseed take?',
    answer: () => (
      <>
        <p>
          None. If a campaign is successful each pledger pays an equal share of
          the funding goal, and the campaigner gets exactly how much they asked
          for; no more, no less.
        </p>
        <p>
          However, due to{' '}
          <a href="https://stripe.com/pricing">Stripe's processing fees</a>{' '}
          (2.9% + 30¢ per transaction) the user would get less than they asked
          for.
        </p>
        <p>
          We fix this problem by raising the pledge amount so the final amount
          after processing fees will equal the ideal pledge amount.
        </p>
        <p>
          For example, if 1,000 people pledge to raise a total of $1,000, then
          each would not pay $1, but around $1.34, since (1.34 - (1.34 * 0.029 +
          0.30)) ≈ 1.00
        </p>
      </>
    ),
  },
  {
    id: 5,
    question: "What's the lowest amount a pledger can pay?",
    answer: () => (
      <>
        <p>
          The minimum possible pledge amount is determined by the maximum number
          of pledgers a campaign can have.
        </p>
        <p>
          For example a campaign for $1,000 with a maximum of 100 pledgers
          implies the least a pledger will pay is $10 if there's 100 pledgers by
          the deadline. Ideally you wouldn't want a maximum number of pledgers
          but if a pledge represented pre-orders for some limited physical then
          it'd make sense.
        </p>
        <p>
          However, while the campaign creator can set a maximum possible number
          of pledgers we set a <i>maximum possible number of pledgers</i> to
          ensure pledgers will pay a minimum of $0.50 due to{' '}
          <a href="https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts">
            Stripe's minimum charge amount
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 6,
    question: 'Is my pledge visible to others?',
    answer: () => (
      <p>
        All pledges are anonymous, being neither visible to the public nor the
        campaigner themself.
      </p>
    ),
  },
  {
    id: 7,
    question:
      "If I get a lot of pledgers, won't a lot of the pledge amount just be processing fees?",
    answer: () => (
      <>
        <p>
          It's true that as the pledge amount decreases the larger the bulk of
          the pledge payment due to processing fees. For instance if you raise
          $1,000 with 4,000 pledgers each will pay $0.25, which becomes $0.57
          when processing fees are added.
        </p>
        <p>
          As inefficient as this may seem, we think it's way better than having
          a small percentage of followers pay larger amounts, which usually
          results in a lower profit for the creator.
        </p>
        <p>
          Of course down the road we could look at ways of optimzing this, such
          as:
        </p>

        <ul role="list">
          <li>Asking Stripe for custom pricing due to our unique model</li>
          <li>
            Asking for outside investments to cover part of the processing fees
          </li>
          <li>
            As customers pledge to multiple campaigns, we can charge them in one
            lump sum (e.g. 2 pledges at $1 each would be $1.34 + 1.34 = $2.68
            separately, or $2.37 as a single transfer
          </li>
          <li>
            Customers can put larger amounts into an digital wallet that we can
            subtract from when they make pledges, e.g. adding $103.30 ($100
            after processing) to a wallet and pledging $1 100 times (vs pleding
            $1.34 individual 100 times resulting in $134 total)
          </li>
          <li>
            Providing alternate payment methods that have lower fees (e.g.
            cryptocurrencies), though that may be tricky due to conversion rates
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 8,
    question:
      "What if I'm not willing to pledge the maximum possible pledge amount?",
    answer: () => (
      <>
        <p>
          If you're not willing to pay the maximum pledge amount, you can just
          wait until more people pledge and the (funding goal) / (current number
          of pledgers) is low enough for you.
        </p>
        <p>
          For instance a campaign raising $1,000 with a minimum of 100 pledgers
          implies a maximum possible pledge of $10. If you and 99 others pledge
          by the deadline then you'll pay $10. However you could not pledge and
          just wait for more than 100 to pledge before you pledge yourself, e.g.
          if 500 people pledge so you'll be paying around $2.
        </p>
        <p>
          Although this would work campaigns may not succeed because everyone's
          waiting for everyone else to pledge first. Instead the campaigner can
          raise the minimum number of pledgers.
        </p>
        <p>
          But later on we may add a feature where you can "pledge later" and
          automatically pledge when the campaign reaches some pledger-defined
          pledge amount, e.g. waiting for 500 pledgers so you ensure you'll be
          paying $2 despite the actual minimum being 100 pledgers.
        </p>
      </>
    ),
  },
  {
    id: 9,
    question: 'What incentives do people get for pledging?',
    answer: () => (
      <>
        <p>
          At the moment Pennyseed is just a glorified donation website with some
          logistics. Ideally the satisfaction of having supported your fellow
          person should be enough, but that isn't enough nowadays.
        </p>
        <p>
          However, if people who actually knew how to make real production web
          applications took over, you could use your pledge as a key to access
          special content and stuff, similar to Patreon and Gumroad.
        </p>
        <p>
          A cool incentive would be for a creator to have recurring campaigns
          where each campaign's funding goal raises an extra $100 or so that
          gets distributed to pledgers from previous campaigns, like a dividend.
        </p>
        <p>
          This would incentivize people to not only support their favorite
          creators, but incentivize people to pledge much higher amounts for
          niche creators that may have very few followers (e.g. someone with 50
          followers that needs to raise $1,000, each paying $20).
        </p>
      </>
    ),
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ - Pennyseed</title>
      </Head>
      <div className="style-links mx-auto max-w-3xl divide-y-2 divide-gray-200">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Frequently asked questions
        </h2>
        <dl className="mt-6 space-y-6 divide-y divide-gray-200">
          {faqs.map((faq) => (
            <Disclosure as="div" key={faq.question} className="pt-6">
              {({ open }) => (
                <>
                  <dt className="text-lg">
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-400">
                      <span className="font-medium text-gray-900">
                        {faq.question}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        <ChevronDownIcon
                          className={classNames(
                            open ? '-rotate-180' : 'rotate-0',
                            'h-6 w-6 transform'
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel
                    as="dd"
                    className="prose mt-2 pr-12 text-base text-gray-500"
                  >
                    <faq.answer />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </>
  );
}
