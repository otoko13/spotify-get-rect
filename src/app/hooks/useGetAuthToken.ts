import { useCookies } from 'next-client-cookies';

const useGetAuthToken = () => {
  const cookies = useCookies();

  return `Bearer ${cookies.get('spotify-auth-token')}`;
};

export default useGetAuthToken;
