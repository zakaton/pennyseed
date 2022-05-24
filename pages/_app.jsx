import '../styles/index.css';
import { UserContextProvider } from '../context/user-context';
import { OnlineContextProvider } from '../context/online-context';
import Layout from '../components/layouts/Layout';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <OnlineContextProvider>
      <UserContextProvider>
        <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
      </UserContextProvider>
    </OnlineContextProvider>
  );
}

export default MyApp;
