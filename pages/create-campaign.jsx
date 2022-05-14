import Head from 'next/head';
import { useState } from 'react';
import CampaignForm from '../components/campaign/CampaignForm';
import CampaignWarningBanner from '../components/campaign/CampaignWarningBanner';

export default function CreateCampaign() {
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  return (
    <>
      <Head>
        <title>Create Campaign - Pennyseed</title>
      </Head>
      <CampaignWarningBanner isCreatingCampaign={isCreatingCampaign} />
      <CampaignForm setIsCreatingCampaign={setIsCreatingCampaign} />
    </>
  );
}
