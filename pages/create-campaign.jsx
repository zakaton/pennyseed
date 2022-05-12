import Head from 'next/head';
import CampaignForm from '../components/CampaignForm';
import WarningBanner from '../components/WarningBanner';

export default function CreateCampaign() {
  const error = true;
  return (
    <>
      <Head>
        <title>Create Campaign - Pennyseed</title>
      </Head>
      {error && <WarningBanner>hello</WarningBanner>}
      <CampaignForm />
    </>
  );
}
