import '../styles/index.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../supabaseClient';

function MyApp({ Component, pageProps }) {
  const [authenticatedState, setAuthenticatedState] =
    useState('not-authenticated');
  const router = useRouter();

  async function checkUser() {
    const user = await supabase.auth.user();
    if (user) {
      setAuthenticatedState('authenticated');
    }
  }

  async function handleAuthChanged(event, session) {
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    });
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthChanged(event, session);
        if (event === 'SIGNED_IN') {
          setAuthenticatedState('authenticated');
          router.push('/profile');
        } else if (event === 'SIGNED_OUT') {
          setAuthenticatedState('not-authenticated');
        }
      }
    );
    checkUser();
    return () => {
      authListener.unsubscribe();
    };
  }, []);
  return (
    <div>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/profile">
          <a>Profile</a>
        </Link>
        {authenticatedState === 'not-authenticated' && (
          <Link href="/sign-in">
            <a>Sign in</a>
          </Link>
        )}
        <Link href="/protected">
          <a>Protected</a>
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
