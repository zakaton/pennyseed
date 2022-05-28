import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MyLink from '../components/MyLink';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user-context';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const { isLoading, user } = useUser();

  const [redirectPathname, setRedirectPathname] = useState();
  useEffect(() => {
    if (router.query.redirect_pathname) {
      console.log(
        'router.query.redirect_pathname',
        router.query.redirect_pathname
      );
      setRedirectPathname(router.query.redirect_pathname);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      console.log('redirecting to ', redirectPathname);
      router.replace(redirectPathname || '/');
    }
  }, [isLoading, user]);

  async function signIn() {
    if (!(email && agree) || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    console.log(
      'redirect',
      redirectPathname
        ? `${window.location.origin}${redirectPathname}`
        : `${window.location.origin}`
    );
    // eslint-disable-next-line no-unused-vars
    const { error, data } = await supabase.auth.signIn(
      {
        email,
      },
      {
        redirectTo: redirectPathname
          ? `${window.location.origin}${redirectPathname}`
          : `${window.location.origin}`,
      }
    );
    if (error) {
      // eslint-disable-next-line no-console
      console.log({ error });
    } else {
      setSubmitted(true);
    }
    setIsSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Thank you
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Check your email for a confirmation link
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !user) {
    return (
      <div className="style-links flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We&apos;ll send a link to your email - no password required
            </p>
          </div>
          <form className="mt-8 space-y-5" action="#" method="POST">
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                  placeholder="Email address"
                  onInput={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex hidden items-center justify-between">
              <div className="flex items-center">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  required={false}
                  className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  onInput={(e) => setAgree(e.target.checked)}
                />
                <label
                  htmlFor="agree"
                  className="ml-2 block text-sm text-gray-900"
                >
                  By signing in I agree to the{' '}
                  <MyLink href="/terms" target="_blank" className="font-medium">
                    terms of use
                  </MyLink>
                  .
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.target.closest('form').reportValidity();
                  signIn();
                }}
              >
                {isSubmitting ? 'Sending Link...' : 'Send Link'}
              </button>
              <div className="flex items-center justify-center pt-3">
                <span className="text-center text-sm text-gray-500">
                  By signing in you agree to the{' '}
                  <MyLink href="/terms" target="_blank">
                    terms of use
                  </MyLink>
                  .
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
