import { useEffect, useState, createContext, useContext, useMemo } from 'react';
import { supabase } from '../utils/supabase-client';

export const UserSessionContext = createContext(null);

export function UserSessionContextProvider(props) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        await fetch('/api/auth', {
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

  const value = useMemo(
    () => ({
      session,
    }),
    [session]
  );

  return <UserSessionContext.Provider value={value} {...props} />;
}

export function useSession() {
  const context = useContext(UserSessionContext);
  return context;
}
