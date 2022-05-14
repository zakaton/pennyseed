/* eslint-disable no-param-reassign */
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

export default function Campaign() {
  const router = useRouter();
  const { id } = router.query;

  const [isGettingCampaign, setIsGettingCampaign] = useState(true);
  const [campaign, setCampaign] = useState(null);

  const getCampaign = async () => {
    // eslint-disable-next-line no-shadow
    const { data: campaign } = await supabase
      .from('campaign')
      .select('*')
      .eq('id', id)
      .single();
    console.log('setting campaign', campaign);
    setCampaign(campaign);
    setIsGettingCampaign(false);
  };
  useEffect(() => {
    if (id) {
      getCampaign();
    }
  }, [id]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (campaign) {
      console.log('subscribing to campaign updates');
      const subscription = supabase
        .from(`campaign:id=eq.${campaign.id}`)
        .on('UPDATE', (payload) => {
          console.log('updated campaign');
          setCampaign({ ...campaign, ...payload.new });
        })
        .subscribe();
      return () => {
        console.log('unsubscribing to campaign updates');
        supabase.removeSubscription(subscription);
      };
    }
  }, [campaign]);

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
      {isGettingCampaign && <div>getting campaign...</div>}
    </>
  );
}
