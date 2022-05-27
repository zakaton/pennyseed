export default async function updateCampaignNumberOfPledgers(
  campaignId,
  supabase
) {
  const { error: getNumberOfPledgersError, count: numberOfPledgers } =
    await supabase
      .from(`pledge`)
      .select('*', { count: 'exact', head: true })
      .match({ campaign: campaignId });
  console.log(
    'get number of pledgers result',
    numberOfPledgers,
    getNumberOfPledgersError
  );

  // don't update if campaign already ended so we can know how much pledgers were charged
  const updateCampaignResult = await supabase
    .from('campaign')
    .update({
      number_of_pledgers: numberOfPledgers,
    })
    .match({ id: campaignId, processed: false });

  console.log('update campaign result', updateCampaignResult);
}
