import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { supabase, getUserProfile } from '../utils/supabase';

export const UserContext = createContext();

export function UserContextProvider(props) {
  const router = useRouter();
  const [user, setUser] = useState(supabase.auth.user());
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [didDeleteAccount, setDidDeleteAccount] = useState(false);

  const updateUserProfile = async () => {
    const user = supabase.auth.user();
    if (user) {
      const profile = await getUserProfile(user);

      setUser({
        ...user,
        ...profile,
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  const setAuthCookie = async (event, session) => {
    if (session) {
      await fetch('/api/account/set-auth-cookie', {
        method: 'POST',
        body: JSON.stringify({ event, session }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);

    updateUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event, session);

        setSession(session);
        switch (event) {
          case 'SIGNED_IN':
            await setAuthCookie(event, session);
            await updateUserProfile();
            break;
          case 'SIGNED_OUT':
            setUser(null);
            break;
          case 'TOKEN_REFRESHED':
            await setAuthCookie(event, session);
            await updateUserProfile();
            break;
          case 'USER_UPDATED':
            // await updateUserProfile();
            break;
          case 'USER_DELETED':
            setUser(null);
            break;
          default:
            console.log(`uncaught event "${event}"`);
            break;
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (user) {
      console.log('subscribing to user updates');
      const subscription = supabase
        .from(`profile:id=eq.${user.id}`)
        .on('UPDATE', (payload) => {
          console.log('updated profile');
          setUser({ ...user, ...payload.new });
        })
        .subscribe();
      return () => {
        console.log('unsubscribing to user updates');
        supabase.removeSubscription(subscription);
      };
    }
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
    setUser(null);
  };

  const deleteAccount = async () => {
    await fetch('/api/account/delete-account');
    signOut();
    setDidDeleteAccount(true);
  };

  const value = {
    user,
    session,
    signOut,
    deleteAccount,
    isLoading,
    didDeleteAccount,
  };

  return <UserContext.Provider value={value} {...props} />;
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}
