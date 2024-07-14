import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const getAuthToken = () =>
  'Bearer ' + cookies().get('spotify-auth-token')?.value;

export async function serverSpotifyFetch(url: string, options: RequestInit) {
  return await fetch(`https://api.spotify.com/v1/${url}`, options).then(
    (response) => {
      if (response.status === 401) {
        const currentPath = headers().get('x-current-path');
        redirect(currentPath ?? '/');
      }
      return response;
    },
  );
}
