'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import closeIcon from '@/_images/close.svg';
import classNames from 'classnames';

interface CloseButtonProps {
  className?: string;
}

const CloseButton = ({ className }: CloseButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={classNames(
        'btn btn-sm btn-circle btn-ghost w-12 h-12',
        className,
      )}
    >
      <Image alt="close" src={closeIcon} fill />
    </button>
  );
};

export default CloseButton;
