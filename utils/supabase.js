import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getSupabaseService = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

export async function getUserProfile(user, _supabase = supabase) {
  const { data: profile } = await _supabase
    .from('profile')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}
