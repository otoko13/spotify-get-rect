import { NextRequest } from 'next/server';
import { getSavedAlbums } from '../spotify';
import { getAccessToken } from '../utils';

export async function GET(request: NextRequest) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return new Response(null, { status: 403 });
  }

  const response = await getSavedAlbums(accessToken);
  return Response.json(response);
}
