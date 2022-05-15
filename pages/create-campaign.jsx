import Head from 'next/head';
import { useState } from 'react';
import CampaignForm from '../components/campaign/CampaignForm';
import CreateCampaignWarningBanner from '../components/campaign/CreateCampaignWarningBanner';

export default function CreateCampaign() {
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  return (
    <>
      <Head>
        <title>Create Campaign - Pennyseed</title>
      </Head>
      <CreateCampaignWarningBanner isCreatingCampaign={isCreatingCampaign} />
      <CampaignForm setIsCreatingCampaign={setIsCreatingCampaign} />
    </>
  );
}
