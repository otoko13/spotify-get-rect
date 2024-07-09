'use client';

import AppCookies from '@/_constants/cookies';
import { useCookies } from 'next-client-cookies';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const cookies = useCookies();
  const router = useRouter();

  const handleSignOut = () => {
    cookies.remove(AppCookies.SPOTIFY_REFRESH_TOKEN);
    cookies.remove(AppCookies.SPOTIFY_AUTH_TOKEN);
    router.push('/');
  };

  return (
    <Link href="" onClick={handleSignOut} className="text-green-500">
      Sign out
    </Link>
  );
}
