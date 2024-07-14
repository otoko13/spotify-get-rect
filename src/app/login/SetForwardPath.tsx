'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function SetForwardPath({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [ready, setReady] = useState<boolean>(false);

  // putting code that uses window/global browser functionality in a useEffect, prevents
  // errors being thrown server side in the pre-render, since this will only be run client-side
  useEffect(() => {
    window.localStorage.setItem(
      'redirect-path',
      searchParams.get('path') ?? '/',
    );
    setReady(true);
  }, [searchParams]);

  return ready ? children : null;
}
