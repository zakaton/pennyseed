import Head from 'next/head';
import CampaignForm from '../components/CampaignForm';
import CampaignBanner from '../components/CampaignBanner';

export default function CreateCampaign() {
  const error = false;
  return (
    <>
      <Head>
        <title>Create Campaign - Pennyseed</title>
      </Head>
      {error && <CampaignBanner>hello</CampaignBanner>}
      <CampaignForm />
    </>
  );
}
