import { GoTrueClient } from '@supabase/gotrue-js';

const myCustomAuthClient = new GoTrueClient({
  url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    apikey: `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  },
  cookieOptions: {
    name: 'sb:token',
    lifetime: 60 * 60 * 24 * 7,
    domain: '',
    path: '/',
    sameSite: 'lax',
  },
});

export default function handler(req, res) {
  myCustomAuthClient.api.setAuthCookie(req, res);
}
