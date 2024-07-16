import CloseButton from '@/_components/closeButton/CloseButton';

export default function AiPage() {
  return (
    <dialog id="ai_modal" className="modal modal-open z-10">
      <div className="modal-box max-w-full w-full rounded-none opacity-90 min-h-screen max-h-screen pb-20">
        <CloseButton />
        AI SHIT
      </div>
    </dialog>
  );
}
