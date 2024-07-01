import { useCookies } from 'next-client-cookies';
import { useMemo } from 'react';

const useGetAuthToken = () => {
  const cookies = useCookies();

  const cookieValue = cookies.get('spotify-auth-token');

  return useMemo(() => `Bearer ${cookieValue}`, [cookieValue]);
};

export default useGetAuthToken;
