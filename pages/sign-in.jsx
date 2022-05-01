import { useState } from 'react';
import { supabase } from '../utils/supabase-client';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  async function signIn() {
    if (!email) {
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const { error, data } = await supabase.auth.signIn({
      email,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.log({ error });
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div>
        <h1>Check your email to sign in</h1>
      </div>
    );
  }

  return (
    <div>
      <main>
        <h1>Sign in</h1>
        <input onChange={(e) => setEmail(e.target.value)} />
        <button type="button" onClick={() => signIn()}>
          sign in
        </button>
      </main>
    </div>
  );
}
