import { useEffect, useState, createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { supabase, getUserProfile } from '../utils/supabase';

export const UserContext = createContext();

export function UserContextProvider(props) {
  const router = useRouter();
  const [user, setUser] = useState(supabase.auth.user());
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateUserProfile = async () => {
      const sessionUser = supabase.auth.user();

      if (sessionUser) {
        const profile = await getUserProfile(sessionUser);

        setUser({
          ...sessionUser,
          ...profile,
        });

        setIsLoading(false);
      }
    };
    updateUserProfile();

    supabase.auth.onAuthStateChange(() => {
      updateUserProfile();
    });
  }, []);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        await fetch('/api/set-auth-cookie', {
          method: 'POST',
          body: JSON.stringify({ event, session }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/sign-in');
  };

  const value = { user, session, signOut, isLoading };

  return <UserContext.Provider value={value} {...props} />;
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}
