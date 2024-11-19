import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: 'org-s63ZpSumEt4Yd88NqZhK3vSi',
  project: 'proj_gddFkp48WXYWLJu9dY3xbiip',
});

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    n: 1,
    prompt: `Create a ${
      params.get('style') ?? ''
    } painting representing the lyrics to the song "${params.get(
      'song',
    )}" by ${params.get('artist')}.`,
    quality: 'standard',
    response_format: 'url',
    size: '1024x1024',
    style: 'natural',
  });
  const image_url = response.data[0].url;
  console.log('IMAGE GENERATED', image_url);

  return Response.json({ url: image_url });
}
