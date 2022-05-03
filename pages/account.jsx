import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase-client';
import AccountLayout from '../components/account/AccountLayout';
import AccountPaymentInfo from '../components/account/AccountPaymentInfo';
import enforceAuthentication from '../utils/enforce-authentication';
import AccountGeneral from '../components/account/AccountGeneral';

const components = {
  '#payment-info': AccountPaymentInfo,
  default: AccountGeneral,
};

export const getServerSideProps = enforceAuthentication;

export default function Account() {
  const router = useRouter();
  const hash = router.asPath.split('#')[1];
  const Component = components[hash] || components.default;
  return <Component />;
}

Account.getNestedLayout = function getNestedLayout(page) {
  return <AccountLayout>{page}</AccountLayout>;
};
