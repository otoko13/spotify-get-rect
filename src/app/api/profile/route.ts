import { NextRequest } from 'next/server';
import { getProfile } from '../spotify';

export async function GET(request: NextRequest) {
  const accessToken = new Headers(request.headers).get('Authorization');

  if (!accessToken) {
    return new Response(null, {status: 403});
  }

  const response = await getProfile(accessToken);
  return Response.json(response);
}