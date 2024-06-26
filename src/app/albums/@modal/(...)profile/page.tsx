import BackButton from '@/_components/backButton/BackButton';
import Profile from '@/_components/profile/Profile';

export default function ProfileModal() {
  console.log('here');
  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box max-w-none w-8/12">
        <BackButton label="X" />
        <Profile />
      </div>
    </dialog>
  );
}
