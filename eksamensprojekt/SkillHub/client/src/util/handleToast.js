import toast from "svelte-french-toast";

export default async function handleToast(promiseFunction, loadingMessage, successMessage, errorMessage, showtime, placement) {
  await toast.promise(
    promiseFunction(),
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    },
    {
      duration: showtime,
      position: placement,
    }
  );
}
