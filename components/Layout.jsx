import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

import { useOnline } from '../utils/online-context';
import OfflineBanner from './OfflineBanner';

export default function Layout({ children }) {
  const { online } = useOnline();
  return (
    <>
      <Head>
        <title>Pennyseed</title>
      </Head>
      <Header />
      {!online && <OfflineBanner />}
      <main className="relative mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
