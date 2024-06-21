import { redirect } from 'next/navigation';
import { generateRandomString } from './utils';
import querystring from 'querystring';

export async function GET() {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email';

  redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: process.env.AUTH_REDIRECT_URI,
      state,
    }));
}