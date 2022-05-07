/* eslint-disable consistent-return */
import { getSupabaseService } from '../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService(req);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  console.log('user to delete', user);

  // delete stripe customer and account

  // delete profile
  const deleteProfileResult = await supabase
    .from('profile')
    .delete()
    .eq('id', user.id);
  console.log('delete profile error', deleteProfileResult);

  // delete campaigns

  // delete pledges

  const { error: deleteUserError } = await supabase.auth.api.deleteUser(
    user.id
  );
  console.log('delete user error', deleteUserError);

  res.status(200).send('deleted user');
}
