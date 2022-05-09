/* eslint-disable no-param-reassign */
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Campaign() {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  return (
    <>
      <Head>
        <title>Campaign - Pennyseed</title>
      </Head>
      <div className="style-links mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Campaign
          </span>
        </h1>
      </div>
      <div className="style-links prose prose-lg mx-auto mt-6 text-gray-500" />
    </>
  );
}
