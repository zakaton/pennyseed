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

  const updateCampaignResult = await supabase
    .from('campaign')
    .update({
      number_of_pledgers: numberOfPledgers,
    })
    .match({ id: campaignId });

  console.log('update campaign result', updateCampaignResult);
}
