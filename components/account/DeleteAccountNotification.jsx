import { useEffect, useState } from 'react';
import { useUser } from '../../context/user-context';
import Notification from '../Notification';

export default function DeleteAccountStatusNotification() {
  const { didDeleteAccount } = useUser();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState();

  useEffect(() => {
    if (didDeleteAccount) {
      setOpen(true);
      setStatus({ type: 'succeeded', title: 'Successfully deleted account' });
    }
  }, [didDeleteAccount]);

  return <Notification open={open} setOpen={setOpen} status={status} />;
}
