import { getSupabaseService } from '../../../utils/supabase';

export default async function handler(req, res) {
  const supabase = getSupabaseService();
  await supabase.auth.api.setAuthCookie(req, res);
}
