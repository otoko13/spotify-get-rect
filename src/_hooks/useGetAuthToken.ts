import AppCookies from '@/_constants/cookies';
import { useCookies } from 'next-client-cookies';
import { useMemo } from 'react';

const useGetAuthToken = () => {
  const cookies = useCookies();

  return useMemo(
    () => `Bearer ${cookies.get(AppCookies.SPOTIFY_AUTH_TOKEN)}`,
    [cookies],
  );
};

export default useGetAuthToken;
