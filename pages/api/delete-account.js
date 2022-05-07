/* eslint-disable consistent-return */
import { getSupabaseService } from '../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService(req);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  console.log('user to delete', user);

  const deleteProfileResult = await supabase
    .from('profile')
    .delete()
    .eq('id', user.id);
  console.log('delete profile error', deleteProfileResult);

  const { error: deleteUserError } = await supabase.auth.api.deleteUser(
    user.id
  );
  console.log('delete user error', deleteUserError);

  console.log('deleted user');
  res.status(200).send('deleted user!');
}
