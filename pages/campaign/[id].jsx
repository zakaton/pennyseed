/* eslint-disable no-param-reassign */
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Campaign from '../../components/campaign/Campaign';

export default function CampaignPage() {
  const router = useRouter();
  const { id } = router.query;

  const [campaignReason, setCampaignReason] = useState(null);

  return (
    <>
      <Head>
        {campaignReason ? (
          <title>Campaign for {campaignReason} - Pennyseed</title>
        ) : (
          <title>Campaign - Pennyseed</title>
        )}
      </Head>
      <Campaign campaignId={id} setCampaignReason={setCampaignReason} />
    </>
  );
}
