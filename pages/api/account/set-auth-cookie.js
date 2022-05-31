import { GoTrueClient } from '@supabase/gotrue-js';

const customAuthClient = new GoTrueClient({
  url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    apikey: `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  },
  cookieOptions: {
    lifetime: 604800,
    domain: '',
    path: '/',
  },
});

export default (req, res) => {
  customAuthClient.api.setAuthCookie(req, res);
};

/*
import { supabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  await supabase.auth.api.setAuthCookie(req, res);
}
*/
