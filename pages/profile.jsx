import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase-client';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  async function fetchProfile() {
    const profileData = await supabase.auth.user();
    if (!profileData) {
      router.push('/sign-in');
    } else {
      setProfile(profileData);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/sign-in');
  }
  if (!profile) return null;
  return (
    <div>
      <h1>Hello, {profile.name}</h1>
      <p>User ID: {profile.id}</p>
      <button type="button" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}
