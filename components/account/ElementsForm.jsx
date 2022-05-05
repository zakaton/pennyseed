import { PaymentElement } from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
}
