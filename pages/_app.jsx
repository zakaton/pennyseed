import '../styles/index.css';
import { UserContextProvider } from '../utils/user-context';
import { OnlineContextProvider } from '../utils/online-context';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const getNestedLayout = Component.getNestedLayout || ((page) => page);
  return (
    <OnlineContextProvider>
      <UserContextProvider>
        <Layout>{getNestedLayout(<Component {...pageProps} />)}</Layout>
      </UserContextProvider>
    </OnlineContextProvider>
  );
}

export default MyApp;
