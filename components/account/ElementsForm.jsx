import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

function SetupForm({ errorMessage, setErrorMessage }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmSetup({
      // `Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account#payment-info`,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      setErrorMessage(null);
    }
  };

  return (
    <form id="addCardForm" onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe}
        type="submit"
        className="mt-2 -inline-flex hidden items-center rounded-md border border-transparent bg-indigo-100 px-2 py-1 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit
      </button>
      {false && errorMessage && (
        <span className="inlint-flex mt-3 items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
          {errorMessage}
        </span>
      )}
    </form>
  );
}

export default SetupForm;
