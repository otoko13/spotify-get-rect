import CloseButton from '@/_components/closeButton/CloseButton';
import classNames from 'classnames';

interface AiModalProps {
  open?: boolean;
}

export default function AiModal({ open }: AiModalProps) {
  return (
    <dialog
      id="my_modal_1"
      className={classNames('modal', { 'modal-open': open })}
    >
      <div className="modal-box max-w-none max-md:w-10/12 w-8/12">
        <CloseButton />
        Test
      </div>
    </dialog>
  );
}
