/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { getSupabaseService } from '../../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  // FILL - delete all pledges
  // FILL - delete campaign
  // FILL - email users that campaign was deleted
}
