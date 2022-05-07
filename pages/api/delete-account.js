/* eslint-disable consistent-return */
import Stripe from 'stripe';
import { getSupabaseService, getUserProfile } from '../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService(req);
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  console.log('user to delete', user);

  // delete campaigns

  // delete pledges

  // delete stripe customer/account
  const profile = await getUserProfile(user, supabase);
  await stripe.customers.del(profile.stripe_customer);
  await stripe.accounts.del(profile.stripe_account);

  // delete profile
  const deleteProfileResult = await supabase
    .from('profile')
    .delete()
    .eq('id', user.id);
  console.log('delete profile error', deleteProfileResult);

  const { error: deleteUserError } = await supabase.auth.api.deleteUser(
    user.id
  );
  console.log('delete user error', deleteUserError);

  res.status(200).send('deleted user');
}
