'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label: string;
}

const BackButton = ({ label }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    >
      {label}
    </button>
  );
};

export default BackButton;
