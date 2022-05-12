import Head from 'next/head';
import CampaignForm from '../components/CampaignForm';

export default function CreateCampaign() {
  return (
    <>
      <Head>
        <title>Create Campaign - Pennyseed</title>
      </Head>
      <div className="style-links mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Create Campaign
          </span>
        </h1>
      </div>
      <CampaignForm />
    </>
  );
}
