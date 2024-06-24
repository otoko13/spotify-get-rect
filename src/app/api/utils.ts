import { NextRequest } from "next/server";

export function getAccessToken(request: NextRequest) {
  return new Headers(request.headers).get('Authorization');
}