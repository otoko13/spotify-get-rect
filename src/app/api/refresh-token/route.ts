import { redirect } from 'next/navigation';
import { generateRandomString } from './utils';
import querystring from 'querystring';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const queryParams = request.nextUrl.searchParams;
  const refreshToken = queryParams.get('refresh_token');

  if (!refreshToken) {
    redirect('/api/get-auth-token');
  }

  const authTokenRequestPayload = {
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    json: true,
    method: 'POST',
  };

  const result = await fetch('https://accounts.spotify.com/api/token', authTokenRequestPayload);
  const jsonResult = await result.json();

  if (result.status !== 200) {
    redirect(`/not-authorised`);
  } 

  const response = NextResponse.redirect(new URL('/', new URL(request.url).origin), {status: 302});
  response.cookies.set('spotify-refresh-token', jsonResult['refresh_token'])

  return response;
}