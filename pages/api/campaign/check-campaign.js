/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { getSupabaseService } from '../../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService();

  console.log('check-campaign!');
}
