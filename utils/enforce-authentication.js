import { supabase } from './supabase';

export default async function enforceAuthentication({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return { props: {}, redirect: { destination: '/sign-in' } };
  }
  return { props: { user } };
}
