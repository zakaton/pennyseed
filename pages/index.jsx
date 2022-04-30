import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

export async function getStaticProps() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  return {
    props: {},
  };
}

function Home() {
  return (
    <div className="mt-10 px-8">
      <Head>
        <title>Pennyseed</title>
      </Head>
      <h1>Hello</h1>
    </div>
  );
}

export default Home;
