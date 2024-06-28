import BackButton from '@/_components/backButton/BackButton';

export default function ProfileModal() {
  console.log('here');
  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <BackButton label="Close" />
        </div>
      </div>
    </dialog>
  );
}
