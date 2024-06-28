'use client';

import { useCookies } from 'next-client-cookies';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const cookies = useCookies();
  const router = useRouter();

  const handleSignOut = () => {
    cookies.remove('spotify-refresh-token');
    cookies.remove('spotify-auth-token');
    router.push('/');
  };

  return (
    <Link href="" onClick={handleSignOut} className="text-green-500">
      Sign out
    </Link>
  );
}
