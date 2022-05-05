import '../styles/index.css';
import { UserContextProvider } from '../context/user-context';
import { OnlineContextProvider } from '../context/online-context';
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
