import { NextRequest } from 'next/server';

export function getAccessToken(request: NextRequest) {
  return new Headers(request.headers).get('Authorization');
}

export function generateOpenAiAuthToken() {
  return `Bearer ${process.env.OPENAI_API_KEY}`;
}
