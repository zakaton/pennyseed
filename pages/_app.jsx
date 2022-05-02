import '../styles/index.css';
import { UserContextProvider } from '../utils/user-context';
import { OnlineContextProvider } from '../utils/online-context';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <OnlineContextProvider>
      <UserContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </OnlineContextProvider>
  );
}

export default MyApp;
