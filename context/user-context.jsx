import { useEffect, useState, createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase-client';

export const UserContext = createContext();

export function UserContextProvider(props) {
  const router = useRouter();
  const [user, setUser] = useState(supabase.auth.user());

  useEffect(() => {
    /*
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user();

      if (sessionUser) {
        const { data: profile } = await supabase
          .from('profile')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        setUser({
          ...sessionUser,
          ...profile,
        });
      }
    };
    getUserProfile();
    */

    supabase.auth.onAuthStateChange(() => {
      setUser(supabase.auth.user());
    });
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const value = useMemo(
    () => ({
      user,
      logout,
    }),
    [user]
  );

  return <UserContext.Provider value={value} {...props} />;
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}
