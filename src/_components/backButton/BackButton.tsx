'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label: string;
}

const BackButton = ({ label }: BackButtonProps) => {
  const router = useRouter();

  return (
    <form method="dialog">
      <button className="btn" onClick={() => router.back()}>
        {label ?? 'Back'}
      </button>
    </form>
  );
};

export default BackButton;
