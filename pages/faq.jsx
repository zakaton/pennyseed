import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Head from 'next/head';

const faqs = [
  {
    question: 'Can anyone make a campaign?',
    answer: () => (
      <>
        <p>
          This is an experiment and is limited to persons 13 years and older in
          the United States. Any campaigns you create must be approved by us.
        </p>
        <p>
          However, even before we approve your campaign, you are still free to
          share your campaign with others, whom can pledge at anytime. Charges
          will only be made if we have approved the campaign before the
          deadline, as well as whether the minimum number of pledgers are met.
        </p>
      </>
    ),
  },
  {
    question: 'Can I edit my campaign after I create one?',
    answer: () => (
      <>
        <p>
          No. After you create a campaign, you cannot edit it, including the
          title, description, funding goal, min/max number of pledgers, and the
          deadline. This is to ensure the pledgers know what they&apos;re going
          to pay and when.
        </p>
        <p>
          For instance, if you want to raise $1,000 with a minimum of 1,000
          pledgers, each will pay at most $1 before processing. If you changed
          the minimum number of pledgers to 100 after people have pledged then
          they&apos;ll be paying at most $10 which wouldn&apos;t be fair.
        </p>
      </>
    ),
  },
  {
    question: 'Is there a directory of all campaigns I can look through?',
    answer: () => (
      <>
        <p>
          No. We think it&apos;s better to allow users to create a campaign and
          share the public link on their existing social networks. We just want
          to be a way for people to pay creators whose content they enjoy,
          nothing more.
        </p>
        <p>
          If we added a way to search and discover campaigns, then we&apos;d
          have to moderate which users and campaigns are created since
          they&apos;d be seen by anyone visiting this site. Plus we&apos;d have
          to deal with malicious users impersonating popular creators and would
          need to add stuff like account verification. We&apos;d prefer to have
          users make campaigns and share the direct link to the campaign on
          their existing social media accounts, leveraging the trust of those
          networks.
        </p>
      </>
    ),
  },
  {
    question: 'Can I set a username or profile picture?',
    answer: () => (
      <>
        <p>
          No. When you create an account, you can only create campaigns or
          pledge to other campaigns.
        </p>
        <p>
          Campaigns do not display any information about the campaigner, because
          if we did then malicious users can impersonate popular creators not on
          this website and trick people into pledging to them.
        </p>
      </>
    ),
  },
  {
    question:
      'What if someone creates a campaign for $1,000 and I&apos;m the only pledger? I don&apos;t wanna end up paying $1,000!',
    answer: () => (
      <>
        <p>
          All campaigns require a <u>minimum number of pledgers</u> that ensures
          a maximum possible pledge amount will be paid.
        </p>
        <p>
          For instance, a minimum number of 100 pledgers ensures that if less
          than 100 people pledge then no one will pay anything. However if 100
          people pledge then each will pay $10, which is the most they&apos;ll
          ever pay. Any more than that will be less than $10 (e.g. if 200 pledge
          then each pays $5, if 500 then $2, and if 1,000 then $1)
        </p>
      </>
    ),
  },
  {
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
          <a href="https://stripe.com/pricing">Stripe&apos;s processing fees</a>{' '}
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
    question: 'What&apos;s the lowest amount a pledger can pay?',
    answer: () => (
      <>
        <p>
          The minimum possible pledge amount is determined by the maximum number
          of pledgers a campaign can have.
        </p>
        <p>
          For example a campaign for $1,000 with a maximum of 100 pledgers
          implies the least a pledger will pay is $10 if there&apos;s 100
          pledgers by the deadline. Ideally you wouldn&apos;t want a maximum
          number of pledgers but if a pledge represented pre-orders for some
          limited physical then it&apos;d make sense.
        </p>
        <p>
          However, while the campaign creator can set a maximum possible number
          of pledgers we set a <i>maximum possible number of pledgers</i> to
          ensure pledgers will pay a minimum of $0.50 due to{' '}
          <a href="https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts">
            Stripe&apos;s minimum charge amount
          </a>
          .
        </p>
      </>
    ),
  },
  {
    question: 'Is my pledge visible to others?',
    answer: () => (
      <p>
        All pledges are anonymous, being neither visible to the public nor the
        campaigner themself.
      </p>
    ),
  },
  {
    question:
      'If I get a lot of pledgers, won&apos;t a lot of the pledge amount just be processing fees?',
    answer: () => (
      <>
        <p>
          It&apos;s true that as the pledge amount decreases the larger the bulk
          of the pledge payment due to processing fees. For instance if you
          raise $1,000 with 4,000 pledgers each will pay $0.25, which becomes
          $0.57 when processing fees are added.
        </p>
        <p>
          As inefficient as this may seem, we think it&apos;s way better than
          having a small percentage of followers pay larger amounts, which
          usually results in a lower profit for the creator.
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
    question:
      'What if I&apos;m not willing to pledge the maximum possible pledge amount?',
    answer: () => (
      <>
        <p>
          If you&apos;re not willing to pay the maximum pledge amount, you can
          just wait until more people pledge and the (funding goal) / (current
          number of pledgers) is low enough for you.
        </p>
        <p>
          For instance a campaign raising $1,000 with a minimum of 100 pledgers
          implies a maximum possible pledge of $10. If you and 99 others pledge
          by the deadline then you&apos;ll pay $10. However you could not pledge
          and just wait for more than 100 to pledge before you pledge yourself,
          e.g. if 500 people pledge so you&apos;ll be paying around $2.
        </p>
        <p>
          Although this would work campaigns may not succeed because
          everyone&apos;s waiting for everyone else to pledge first. Instead the
          campaigner can raise the minimum number of pledgers.
        </p>
        <p>
          But later on we may add a feature where you can &quot;pledge
          later&quot; and automatically pledge when the campaign reaches some
          pledger-defined pledge amount, e.g. waiting for 500 pledgers so you
          ensure you&apos;ll be paying $2 despite the actual minimum being 100
          pledgers.
        </p>
      </>
    ),
  },
  {
    question: 'What incentives do people get for pledging?',
    answer: () => (
      <>
        <p>
          At the moment Pennyseed is just a glorified donation website with some
          logistics. Ideally the satisfaction of having supported your fellow
          person should be enough, but that isn&apos;t enough nowadays.
        </p>
        <p>
          However, if people who actually knew how to make real production web
          applications took over, you could use your pledge as a key to access
          special content and stuff, similar to Patreon and Gumroad.
        </p>
        <p>
          A cool incentive would be for a creator to have recurring campaigns
          where each campaign&apos;s funding goal raises an extra $100 or so
          that gets distributed to pledgers from previous campaigns, like a
          dividend.
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

faqs.forEach((item, index) => {
  // eslint-disable-next-line no-param-reassign
  item.id = index + 1;
});

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
