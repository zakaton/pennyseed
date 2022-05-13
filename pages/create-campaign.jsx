import Head from 'next/head';
import CampaignForm from '../components/campaign/CampaignForm';
import CampaignWarningBanner from '../components/campaign/CampaignWarningBanner';

export default function CreateCampaign() {
  return (
    <>
      <Head>
        <title>Create Campaign - Pennyseed</title>
      </Head>
      <CampaignWarningBanner />
      <CampaignForm />
    </>
  );
}
