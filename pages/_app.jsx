import '../styles/index.css';
import { useEffect } from 'react';
import { isIOS } from 'react-device-detect';
import { UserContextProvider } from '../context/user-context';
import { OnlineContextProvider } from '../context/online-context';
import Layout from '../components/layouts/Layout';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  const updateManifest = async () => {
    const manifestElement = document.querySelector("link[rel='manifest']");
    if (manifestElement) {
      manifestElement.href = isIOS ? '/manifest-ios.json' : '/manifest.json';
    }
  };
  useEffect(() => {
    updateManifest();
  }, [isIOS]);

  return (
    <OnlineContextProvider>
      <UserContextProvider>
        <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
      </UserContextProvider>
    </OnlineContextProvider>
  );
}

export default MyApp;
