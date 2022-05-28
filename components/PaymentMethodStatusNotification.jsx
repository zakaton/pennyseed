import { useEffect, useState } from 'react';
import { useUser } from '../context/user-context';
import Notification from './Notification';

export default function PaymentMethodStatusNotification() {
  const { getPaymentMethodStatus } = useUser();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState();

  useEffect(() => {
    if (getPaymentMethodStatus) {
      const succeeded = getPaymentMethodStatus.type === 'succeeded';
      setOpen(!succeeded);
      setStatus(getPaymentMethodStatus);
    }
  }, [getPaymentMethodStatus]);

  return <Notification open={open} setOpen={setOpen} status={status} />;
}
