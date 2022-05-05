import '../styles/index.css';
import { UserSessionContextProvider } from '../context/user-session-context';
import { UserContextProvider } from '../context/user-context';
import { OnlineContextProvider } from '../context/online-context';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <OnlineContextProvider>
      <UserSessionContextProvider>
        <UserContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserContextProvider>
      </UserSessionContextProvider>
    </OnlineContextProvider>
  );
}

export default MyApp;
