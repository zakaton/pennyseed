import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';

import { useOnline } from '../../context/online-context';
import OfflineBanner from '../OfflineBanner';
import DeleteAccountStatusNotification from '../account/DeleteAccountStatusNotification';

export default function Layout({ children }) {
  const { online } = useOnline();
  return (
    <>
      <Head>
        <title>Pennyseed</title>
      </Head>
      <Header />
      {!online && <OfflineBanner />}
      <DeleteAccountStatusNotification />
      <main className="relative mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
