import { generateRandomString } from '@/_utils/sharedUtils';
import { redirect } from 'next/navigation';
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
  'playlist-modify-public',
  'playlist-modify-private',
];

const scope = REQUESTED_PERMISSIONS.join(' ');
const state = generateRandomString(16);

export default function SpotifyAuthForwarder() {
  return redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        redirect_uri: `${process.env.HOST}${process.env.AUTH_REDIRECT_URI}`,
        response_type: 'code',
        scope,
        state,
      }),
  );
}
