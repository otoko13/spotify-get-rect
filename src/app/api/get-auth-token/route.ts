import { redirect } from 'next/navigation';
import { generateRandomString } from './utils';
import querystring from 'querystring';

export async function GET() {
  const state = generateRandomString(16);
  const scope =
    'user-read-private user-read-email user-library-read user-modify-playback-state user-read-playback-state user-top-read';

  // no way to pass the path to the redirect URI right now, they won't allow wildcards or query params

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
