import { redirect } from 'next/navigation';
import { generateRandomString } from './utils';
import querystring from 'querystring';

const REQUESTED_PERMISSIONS = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-top-read',
  'streaming',
  'playlist-read-private',
];

export async function GET() {
  const state = generateRandomString(16);
  const scope = REQUESTED_PERMISSIONS.join(' ');

  // no way to pass the path to the redirect URI right now, they won't allow wildcards or query params

  console.log(scope);
  console.log(`${process.env.HOST}${process.env.AUTH_REDIRECT_URI}`);

  redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri: `${process.env.HOST}${process.env.AUTH_REDIRECT_URI}`,
        state,
      }),
  );
}
