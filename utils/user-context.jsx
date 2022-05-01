import { useEffect, useState, createContext, useContext, useMemo } from 'react';
import { supabase } from './supabase-client';

export const UserContext = createContext(null);

export function UserContextProvider(props) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const currentSession = supabase.auth.session();
    setSession(currentSession);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        await fetch('/api/auth', {
          method: 'POST',
          body: JSON.stringify({ event, session: newSession }),
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

  const value = {
    session,
  };

  return <UserContext.Provider value={value} {...props} />;
}

export function useSession() {
  const context = useContext(UserContext);
  return context;
}
