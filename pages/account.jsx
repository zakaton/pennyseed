import Head from 'next/head';
import { supabase } from '../utils/supabase-client';

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return { props: {}, redirect: { destination: '/sign-in' } };
  }
  return { props: { user } };
}

export default function Account({ user }) {
  return (
    <>
      <Head>
        <title>Account - Pennyseed</title>
      </Head>
      <div className="prose mx-auto max-w-prose text-lg">
        <h1>
          <span className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Account
          </span>
        </h1>
      </div>
      <div className="prose prose-lg prose-yellow mx-auto mt-6 text-gray-500">
        <h3>hello {user.email}</h3>
        <p>world</p>
      </div>
    </>
  );
}
