/* eslint-disable no-param-reassign */
import Head from 'next/head';
import MyLink from '../components/MyLink';

const monetizationProsAndCons = [
  {
    name: 'Pay-per-Media',
    pros: ['Money comes from users'],
    cons: [
      'Hard to Share and reach more people',
      'Price is arbitrary due to no overhead',
      'Worry about Piracy and Torrenting',
    ],
  },
  {
    name: 'Subscriptions',
    pros: ['Users pay a regular fixed amount', 'Users can access all content'],
    cons: [
      'Users still pay even if no new content is created',
      'Users have to subscribe for a period just to watch a single piece of content, cancelling after',
    ],
  },
  {
    name: 'Streaming',
    pros: [
      'Users pay a regular fixed amount',
      'User payment is distributed amongst creators based on streamed content',
    ],
    cons: [
      'Pay-per-Stream model can be exploited',
      'Rewards replayability over quality',
      'Incentivizes Creators to exploit fans to stream their content multiple times for cheap prizes',
      "Users have to subscribe to an entire Network even when they just wanna watch 1 or 2 creators' content",
    ],
  },
  {
    name: 'Advertising',
    pros: ['Content can be free', 'Can Share and reach more people'],
    cons: [
      'Incentivizes Creators to generate clickbait content',
      'Money comes from sponsors, not viewers',
      'Creators are beholden to sponsors, compromising content',
    ],
  },
  {
    name: 'Donations',
    pros: [
      'Money comes from Users',
      'Content can be Free',
      "Quality over Quantity, since more content doesn't mean more donations",
    ],
    cons: [
      "Users aren't sure how much to pay (nor how much the Creator needs/has)",
      'Unstable income due to irregular donations',
      'Users can be emotionally manipulated into donating',
    ],
  },
  {
    name: 'Crowdfunding',
    pros: [
      'Money comes from Users',
      "There's a clear goal for users to reach",
      'Content can be Free',
    ],
    cons: [
      "Once passed the goal, anything extra could've gone to other Creators they supported",
      'Winner-takes-all approach where few popular Creators get the bulk of the potential pledges',
      'Irregular pledge amounts lead to pandering to large pledgers who contribute most of the funding',
    ],
  },
  {
    name: 'Merchandise',
    pros: ['Money comes from Users', 'Free advertising from wearers'],
    cons: [
      'Users who want to support the Creator may not want that particular product',
      'Creators are incentivized to sell cheap products for high prices for greater profits',
      'Manufacturing & Shipping Fees',
    ],
  },
];

monetizationProsAndCons.forEach((method, index) => {
  method.id = index + 1;
  method.pros = method.pros.map((text, _index) => ({ id: _index + 1, text }));
  method.cons = method.cons.map((text, _index) => ({ id: _index + 1, text }));
});

export default function About() {
  return (
    <>
      <Head>
        <title>Why - Pennyseed</title>
      </Head>
      <div className="style-links mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Why Pennyseed?
          </span>
        </h1>
      </div>
      <div className="style-links prose prose-lg mx-auto mt-6 text-gray-500">
        <h3>
          Why another crowdfunding platform? There&apos;s already Patreon,
          Kickstarter, Gofundme, Gumroad...
        </h3>
        <p>
          Though there are several ways for people to monetize online, each have
          their pros and cons:
        </p>

        <ol role="list">
          {monetizationProsAndCons.map((method) => (
            <li key={method.id}>
              {method.name}
              <ul role="list" className="list-none">
                {method.pros.map((pro) => (
                  <li key={pro.id} className="pro">
                    {pro.text}
                  </li>
                ))}
                {method.cons.map((con) => (
                  <li key={con.id} className="con">
                    {con.text}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h3>...but then we realized something:</h3>

        <ul role="list">
          <li style={{ listStyleType: '"😔"' }}>
            Problems{' '}
            <ul role="list">
              <li className="con">
                Arbitrary Pricing with no guarantee of a stable income
              </li>
              <li className="con">
                Little incentive for supporters to encourage others to
                contribute
              </li>
              <li className="con">
                Creator has to do extra work for money (merchanidise,
                commissions, side jobs, etc)
              </li>
            </ul>
          </li>
          <li style={{ listStyleType: '"💡"' }}>
            Insight
            <ul role="list">
              <li>The Creator wants everyone to enjoy it</li>
              <li>Most of the money goes to living expenses</li>
              <li>
                Fans aren&apos;t paying for Content - they&apos;re paying for
                Future Content
              </li>
            </ul>
          </li>

          <li style={{ listStyleType: '"🤩"' }}>
            Solution
            <ul role="list">
              <li>
                A &quot;Split-the-Bill&quot; Model that divides the Funding Goal
                by the number of Pledgers
              </li>
              <li>
                Specify a <u>minimum number of pledgers</u> to ensure a maximum
                possible pledge amount so pledgers aren&apos;t scared of paying
                too much
              </li>
              <li>
                A Minimal Design that doesn&apos;t try to be a Social Network
              </li>
            </ul>
          </li>
          <li style={{ listStyleType: '"👍"' }}>
            Benefits
            <ul role="list">
              <li className="pro">
                Creators are guarenteed the Exact Amount they specify
              </li>
              <li className="pro">
                Pledgers are incentivized to share the Campaign to reduce their
                Pledge Share
              </li>
              <li className="pro">
                Minimal Design allows for a wide range of emergent applications
                and extensions
              </li>
            </ul>
          </li>
        </ul>

        <style jsx>{`
          li.pro {
            list-style-type: '✅';
          }
          li.con {
            list-style-type: '❌';
          }
        `}</style>

        <h3>How does it work?</h3>

        <ol role="list">
          <li>Sign in</li>
          <li>Create a Stripe Account to receive payments</li>
          <li>
            Create a Campaign specifying the following:
            <ul role="list">
              <li>Funding Goal</li>
              <li>Reason</li>
              <li>Deadline</li>
              <li>Minimum Number of Pledgers</li>
            </ul>
          </li>
          <li>
            Pledgers login, add their payment information, and pledge to your
            campaign
          </li>
          <li>
            By the end of the deadline:
            <ul role="list">
              <li>
                If the minimum number of pledgers are met, all pledgers are
                charged (funding goal)/(number of pledgers) and the campaigner
                gets exactly how much they set in the funding goal
              </li>
              <li>If not, then no charges are made and life goes on :(</li>
            </ul>
          </li>
        </ol>
        <p>By the deadline, if the Minimum number of Pledgers is met:</p>
        <ol role="list" start="5">
          <li>
            Each pledger is charged (Target Amount)/(Number of Pledgers), which
            is sent directly to the Campaign Creator
          </li>
        </ol>
        <p>Otherwise, if the Minimum Number of Pledgers isn&apos;t met:</p>
        <ol role="list" start="5">
          <li>Nothing happens; life goes on</li>
        </ol>

        <p className="font-bold">
          You can check out our <MyLink href="/faq">FAQ</MyLink> for more
          details
        </p>
      </div>
    </>
  );
}
