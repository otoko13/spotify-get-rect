import CloseButton from '@/_components/closeButton/CloseButton';

export default function AiPage() {
  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box max-w-none max-md:w-10/12 w-8/12">
        <CloseButton />
        AI SHIT
      </div>
    </dialog>
  );
}
