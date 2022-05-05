import { useEffect, useState, createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase-client';

export const UserContext = createContext();

export function UserContextProvider(props) {
  const router = useRouter();
  const [user, setUser] = useState(supabase.auth.user());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

        setIsLoading(false);
      }
    };
    getUserProfile();

    supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/sign-in');
  };

  const value = useMemo(
    () => ({
      user,
      signOut,
      isLoading,
    }),
    [user, isLoading]
  );

  return <UserContext.Provider value={value} {...props} />;
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}
