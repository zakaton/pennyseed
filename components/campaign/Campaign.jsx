/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import {
  formatDollars,
  defaultLocale,
  getMaximumPossibleNumberOfPledgers,
} from '../../utils/campaign-utils';
import { useUser } from '../../context/user-context';

export default function Campaign({ campaignId, setCampaignReason }) {
  const [isGettingCampaign, setIsGettingCampaign] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const { user } = useUser();

  const [isMyCampaign, setIsMyCampaign] = useState(false);
  useEffect(() => {
    if (user && campaign) {
      setIsMyCampaign(user.id === campaign.created_by);
    }
  }, [user, campaign]);

  const getCampaign = async () => {
    // eslint-disable-next-line no-shadow
    const { data: campaign } = await supabase
      .from('campaign')
      .select('*')
      .eq('id', campaignId)
      .single();
    console.log('setting campaign', campaign);
    if (campaign) {
      setCampaignReason(campaign.reason);
    }
    setCampaign(campaign);
    setIsGettingCampaign(false);
  };
  useEffect(() => {
    if (campaignId) {
      getCampaign();
    }
  }, [campaignId]);

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
        .on('DELETE', (payload) => {
          console.log('deleted campaign', payload);
          setCampaign(null);
        })
        .subscribe();
      return () => {
        console.log('unsubscribing to campaign updates');
        supabase.removeSubscription(subscription);
      };
    }
  }, [campaign]);

  const [
    hypotheticalFinalNumberOfPledgers,
    setHypotheticalFinalNumberOfPledgers,
  ] = useState(0);
  const [maximumPossibleNumberOfPledgers, setMaximumPossibleNumberOfPledgers] =
    useState(Infinity);
  useEffect(() => {
    if (campaign) {
      setMaximumPossibleNumberOfPledgers(
        getMaximumPossibleNumberOfPledgers(campaign.funding_goal)
      );
    }
  }, [campaign]);

  const [deadline, setDeadline] = useState('');
  useEffect(() => {
    if (campaign) {
      setDeadline(new Date(campaign.deadline));
    }
  }, [campaign]);

  const [createdDate, setCreatedDate] = useState('');
  useEffect(() => {
    if (campaign) {
      setCreatedDate(new Date(campaign.created_at));
    }
  }, [campaign]);

  return (
    <div className="style-links mx-auto max-w-prose text-lg shadow sm:rounded-lg">
      <div className="py-3 px-5 pb-5 sm:py-4 sm:pb-5">
        {isGettingCampaign && (
          <div className="style-links prose prose-lg mx-auto text-center text-xl text-gray-500">
            <p>Loading campaign...</p>
          </div>
        )}

        {!isGettingCampaign &&
          (campaign ? (
            <>
              <div className="mx-auto max-w-prose text-lg">
                <h1>
                  <span className="mt-2 block text-center text-2xl font-bold leading-8 tracking-tight text-gray-900 sm:text-3xl">
                    I am raising {formatDollars(campaign.funding_goal, false)}{' '}
                    for {campaign.reason}
                  </span>
                </h1>
              </div>
              <div className="mx-auto max-w-prose text-lg">
                <div className="prose prose-lg prose-yellow mx-auto mt-4 text-xl text-gray-500">
                  <p>
                    This campaign requires a minimum of{' '}
                    <span className="font-bold ">
                      {campaign.minimum_number_of_pledgers.toLocaleString(
                        defaultLocale
                      )}
                    </span>{' '}
                    {campaign.minimum_number_of_pledgers === 1
                      ? 'pledger'
                      : 'pledgers'}{' '}
                    by{' '}
                    <span className="font-bold">
                      {deadline && deadline.toLocaleString()}
                    </span>
                    .
                  </p>
                  <p>
                    There {campaign.number_of_pledgers === 1 ? 'is' : 'are'}{' '}
                    currently{' '}
                    <span className="font-bold">
                      {campaign.number_of_pledgers > 0
                        ? campaign.number_of_pledgers.toLocaleString(
                            defaultLocale
                          )
                        : 'no'}
                    </span>{' '}
                    pledgers.
                  </p>
                  <p>
                    This is some text with{' '}
                    <input
                      required
                      type="number"
                      inputMode="numeric"
                      name="hypotheticalFinalNumberOfPledgers"
                      id="hypotheticalFinalNumberOfPledgers"
                      step="1"
                      value={hypotheticalFinalNumberOfPledgers}
                      min={0}
                      max={maximumPossibleNumberOfPledgers}
                      onInput={(e) =>
                        setHypotheticalFinalNumberOfPledgers(
                          Number(e.target.value)
                        )
                      }
                      className="inline-block rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    />{' '}
                    an input.
                  </p>
                  <p className="italic">
                    This campaign was created at{' '}
                    <span className="font-bold">
                      {createdDate && createdDate.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="style-links prose prose-lg mx-auto text-center text-xl text-gray-500">
              <p>Campaign not found.</p>
            </div>
          ))}
      </div>
      {campaign && user && (
        <div className="mt-1 flex items-end justify-end gap-2 bg-gray-50 px-4 py-3 text-right text-xs sm:px-6 sm:text-sm">
          {!isMyCampaign && (
            <>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Pledge
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Remove Pledge
              </button>
            </>
          )}
          {isMyCampaign && (
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Campaign
            </button>
          )}
        </div>
      )}
    </div>
  );
}
