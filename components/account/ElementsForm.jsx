import { PaymentElement } from '@stripe/react-stripe-js';

function SetupForm() {
  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
}

export default SetupForm;
