import { useEffect, useState } from 'react';
import { useUser } from '../context/user-context';
import Notification from './Notification';

export default function PaymentMethodsStatusNotification() {
  const { getPaymentMethodsStatus } = useUser();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState();

  useEffect(() => {
    if (getPaymentMethodsStatus) {
      const succeeded = getPaymentMethodsStatus.type === 'succeeded';
      setOpen(!succeeded);
      setStatus(getPaymentMethodsStatus);
    }
  }, [getPaymentMethodsStatus]);

  return <Notification open={open} setOpen={setOpen} status={status} />;
}
