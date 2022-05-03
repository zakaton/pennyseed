import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase-client';
import AccountLayout from '../components/account/AccountLayout';
import enforceAuthentication from '../utils/enforce-authentication';
import AccountPaymentInfo from '../components/account/AccountPaymentInfo';
import AccountGeneral from '../components/account/AccountGeneral';

const navigation = [
  { hash: '', component: AccountGeneral },
  { hash: 'payment-info', component: AccountPaymentInfo },
];
navigation.forEach((item, index) => {
  // eslint-disable-next-line no-param-reassign
  item.id = index + 1;
});

export const getServerSideProps = enforceAuthentication;

export default function Account() {
  const router = useRouter();
  const hash = router.asPath.split('#')[1] || '';
  return navigation.map((item) => {
    const current = item.hash === hash;
    return (
      <div key={item.id} hidden={!current}>
        <item.component />
      </div>
    );
  });
}

Account.getNestedLayout = function getNestedLayout(page) {
  return <AccountLayout>{page}</AccountLayout>;
};
