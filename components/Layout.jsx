import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Pennyseed</title>
      </Head>
      <Header />
      <main className="relative mx-auto max-w-7xl divide-y divide-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
