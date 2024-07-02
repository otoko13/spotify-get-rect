import { useCookies } from 'next-client-cookies';
import { useEffect, useMemo } from 'react';

const useGetAuthToken = () => {
  const cookies = useCookies();

  return useMemo(
    () => `Bearer ${cookies.get('spotify-auth-token')}`,
    [cookies],
  );
};

export default useGetAuthToken;
