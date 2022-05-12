import Head from 'next/head';
import CampaignForm from '../components/CampaignForm';

export default function CreateCampaign() {
  return (
    <>
      <Head>
        <title>Create Campaign - Pennyseed</title>
      </Head>
      <CampaignForm />
    </>
  );
}
