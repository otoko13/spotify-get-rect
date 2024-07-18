import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60;

const openai = new OpenAI({
  organization: 'org-s63ZpSumEt4Yd88NqZhK3vSi',
  project: 'proj_gddFkp48WXYWLJu9dY3xbiip',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    quality: 'standard',
    response_format: 'url',
    style: 'natural',
    prompt: `Create a ${
      params.get('style') ?? ''
    } painting representing the lyrics to the song "${params.get(
      'song',
    )}" by ${params.get('artist')}.`,
    n: 1,
    size: '1024x1024',
  });
  const image_url = response.data[0].url;
  console.log('IMAGE GENERATED', image_url);

  return Response.json({ url: image_url });
}
