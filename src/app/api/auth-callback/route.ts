import { redirect } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const queryParams = request.nextUrl.searchParams;
  const error = queryParams.get('error');

  if (error) {
    redirect(`/not-authorised`);
  }

  const code = queryParams.get('code') ?? undefined;
  const state = queryParams.get('state');

  if (state === null) {
    redirect(`/not-authorised`);
  }

  const authTokenRequestPayload = {
    body: new URLSearchParams({
      code: code ?? '',
      redirect_uri: process.env.AUTH_REDIRECT_URI ?? '',
      grant_type: 'authorization_code'
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

  console.log(`\n\nTOKEN RETRIEVED: ${JSON.stringify(jsonResult)}\n\n`);

  const response = NextResponse.redirect(new URL('/', new URL(request.url).origin), {status: 302});
  response.cookies.set('spotify-auth-token', jsonResult['access_token'])

  return response;
}