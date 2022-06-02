/* eslint-disable consistent-return */
import Stripe from 'stripe';
import {
  getSupabaseService,
  getUserProfile,
  paginationSize,
  isUserAdmin,
  getUserByAccessToken,
} from '../../../utils/supabase';
import sendEmail, { emailAdmin } from '../../../utils/send-email';
import { formatDollars } from '../../../utils/campaign-utils';

async function emailPledgers({ supabase, from, to, userToDelete }) {
  const { data: pledgesToEmail, error } = await supabase
    .from('pledge')
    .select('*, profile!inner(*), campaign!inner(*)')
    .eq('campaign.created_by', userToDelete.id)
    .eq('campaign.processed', false)
    .contains('profile.notifications', ['email_campaign_deleted'])
    .range(from, to);

  console.log('pledgesToEmail', pledgesToEmail);

  if (!error) {
    await sendEmail(
      ...pledgesToEmail.map((pledge) => ({
        to: pledge.profile.email,
        subject: `A Campaign you pledged to was deleted`,
        dynamicTemplateData: {
          heading: `A Campaign you pledged to was deleted`,
          body: `A campaign trying to raise ${formatDollars(
            pledge.campaign.funding_goal,
            false
          )} for ${pledge.campaign.reason} was deleted.`,
        },
      }))
    );
  } else {
    console.error('error fetching campaigns', error);
  }
}

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const sendError = (error) =>
    res.status(200).json({
      status: {
        type: 'failed',
        title: 'Failed to delete User',
        ...error,
      },
    });

  const { user } = await getUserByAccessToken(supabase, req);
  if (!user) {
    return sendError({ message: 'you are not signed in' });
  }

  let userToDelete;
  if (req.method === 'POST') {
    if (isUserAdmin(user)) {
      const { userId } = req.body;
      if (userId) {
        const { data: foundUser, error } = await supabase
          .from('profile')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error(error);
          return sendError({ message: 'unable to find user' });
        }
        if (foundUser) {
          userToDelete = foundUser;
        }
      } else {
        return sendError({ message: 'userId no defined' });
      }
    } else {
      return sendError({ message: 'you are not authorized to delete users' });
    }
  } else {
    userToDelete = user;
  }

  // email pledgers about deleted campaigns
  const {
    count: numberOfPledgesToEmail,
    error: getNumberOfPledgesToEmailError,
  } = await supabase
    .from('pledge')
    .select('*, profile!inner(*), campaign!inner(*)', {
      count: 'exact',
      head: true,
    })
    .eq('campaign.created_by', userToDelete.id)
    .eq('campaign.processed', false)
    .contains('profile.notifications', ['email_campaign_deleted']);

  console.log('numberOfPledgesToEmail', numberOfPledgesToEmail);
  console.log('getNumberOfPledgesToEmailError', getNumberOfPledgesToEmailError);
  if (!getNumberOfPledgesToEmailError) {
    if (numberOfPledgesToEmail > 0) {
      const emailPledgersPromises = [];
      for (
        let from = 0, to = paginationSize - 1;
        from < numberOfPledgesToEmail;
        from += paginationSize, to += paginationSize
      ) {
        const emailPledgersPromise = emailPledgers({
          supabase,
          from,
          to,
          userToDelete,
        });
        emailPledgersPromises.push(emailPledgersPromise);
      }
      await Promise.all(emailPledgersPromises);
    }
  }

  await supabase
    .from('profile')
    .update({
      active_campaign: null,
    })
    .eq('id', userToDelete.id);

  // delete campaigns
  const deleteCampaignsResult = await supabase
    .from('campaign')
    .delete()
    .eq('created_by', userToDelete.id);
  console.log('delete campaigns result', deleteCampaignsResult);

  // delete pledges
  const deletePledgesResult = await supabase
    .from('pledge')
    .delete()
    .eq('profile', userToDelete.id);
  console.log('delete pledges result', deletePledgesResult);

  // delete stripe customer/account
  const profile = await getUserProfile(userToDelete, supabase);
  try {
    await stripe.customers.del(profile.stripe_customer);
  } catch (error) {
    console.error('error deleting stripe customer', error);
  }
  try {
    await stripe.accounts.del(profile.stripe_account);
  } catch (error) {
    console.error('error deleting stripe account', error);
  }

  console.log('userToDelete', userToDelete);

  // delete profile
  const deleteProfileResult = await supabase
    .from('profile')
    .delete()
    .eq('id', userToDelete.id);
  console.log('delete profile result', deleteProfileResult);

  const { error: deleteUserError } = await supabase.auth.api.deleteUser(
    userToDelete.id
  );
  console.log('delete user result', deleteUserError);

  await emailAdmin({
    subject: 'Deleted User',
    dynamicTemplateData: {
      heading: `Goodbye ${userToDelete.email}!`,
      body: `A user with email ${userToDelete.email} has deleted their account.`,
    },
  });

  res.status(200).json({
    status: {
      type: 'succeeded',
      title: 'Deleted Account',
      message: 'Successfully deleted Account',
    },
  });
}
