/* eslint-disable consistent-return */
import { getSupabaseService } from '../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService(req);
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  console.log('user to delete', user);
  await supabase.auth.api.deleteUser(user.id);
  console.log('deleted user');
  await supabase.auth.signOut();
  console.log('signed out user');
  res.redirect('/');
}
