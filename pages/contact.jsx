/* eslint-disable no-param-reassign */
import Head from 'next/head';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact - Pennyseed</title>
      </Head>
      <div className="style-links mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Contact
          </span>
        </h1>
      </div>
      <div className="style-links prose prose-lg mx-auto mt-6 text-gray-500" />
    </>
  );
}
