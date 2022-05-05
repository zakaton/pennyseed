import { PaymentElement } from '@stripe/react-stripe-js';

function SetupForm() {
  return (
    <form>
      <PaymentElement />
      <button type="submit">Submit</button>
    </form>
  );
}

export default SetupForm;
