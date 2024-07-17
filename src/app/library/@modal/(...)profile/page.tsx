import CloseButton from '@/_components/closeButton/CloseButton';
import Profile from '@/_components/profile/Profile';

export default function ProfileModal() {
  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box max-w-none max-md:w-10/12 w-8/12">
        <CloseButton className="absolute right-4 top-4 " />
        <Profile />
      </div>
    </dialog>
  );
}
