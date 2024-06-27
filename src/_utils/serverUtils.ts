import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const generateRandomString = (length: number): string => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

export const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

export const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(input))))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

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
