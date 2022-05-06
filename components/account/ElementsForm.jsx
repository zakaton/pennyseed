import { PaymentElement } from '@stripe/react-stripe-js';

function SetupForm() {
  return (
    <form>
      <PaymentElement />
      <button
        type="submit"
        className="mt-2 inline-flex hidden items-center rounded-md border border-transparent bg-indigo-100 px-2 py-1 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
}

export default SetupForm;
