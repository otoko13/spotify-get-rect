export default function FullPageSpinner() {
  return (
    <div className="fixed flex w-screen h-screen justify-center items-center overflow-hidden">
      <div className="loading loading-bars loading-lg text-primary absolute" />
    </div>
  );
}
