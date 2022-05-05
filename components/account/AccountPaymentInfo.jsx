import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function AccountPaymentInfo() {
  return (
    <>
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Payment Info
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add and remove payment methods.
            </p>
          </div>
        </div>
      </div>
      <Elements stripe={stripe} />
    </>
  );
}
