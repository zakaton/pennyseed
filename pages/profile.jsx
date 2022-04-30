import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../supabaseClient';

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

  if (!profile) return null;

  return (
    <div>
      <h1>{profile.name}</h1>
    </div>
  );
}
