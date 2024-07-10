'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  // we use this intermediate component so we can set a redirect path in localstorage
  const searchParams = useSearchParams();

  // putting code that uses window/global browser functionality in a useEffect, prevents
  // errors being thrown server side in the pre-render, since this will only be run client-side
  useEffect(() => {
    window.localStorage.setItem(
      'redirect-path',
      searchParams.get('path') ?? '/',
    );
    redirect('/api/get-auth-token');
  }, [searchParams]);
}
