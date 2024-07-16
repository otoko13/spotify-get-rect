'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import closeIcon from '@/_images/close.svg';

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 w-12 h-12"
    >
      <Image alt="close" src={closeIcon} fill />
    </button>
  );
};

export default BackButton;
