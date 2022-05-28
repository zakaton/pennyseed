import { createClient } from '@supabase/supabase-js';
import cookie from 'cookie';

export const paginationSize = 1_000;

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getSupabaseService = (req) => {
  const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  if (req) {
    const token = cookie.parse(req.headers.cookie)['sb-access-token'];
    supabaseService.auth.session = () => ({
      access_token: token,
    });
  }
  return supabaseService;
};

export async function getUserProfile(user, _supabase = supabase) {
  const { data: profile } = await _supabase
    .from('profile')
    .select('*')
    .eq('id', user.id)
    .single();
  return profile;
}
