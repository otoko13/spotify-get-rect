import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60;

const client = new OpenAI();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  try {
    const response = await client.images.generate({
      model: 'gpt-image-2',
      moderation: 'low',
      n: 1,
      output_format: 'png',
      prompt: `Create a ${
        params.get('style') ?? ''
      } painting representing the lyrics to the song "${params.get(
        'song',
      )}" by ${params.get('artist')}.`,
      quality: 'medium',
      size: '1024x1024',
    });
    const imageB64 = response?.data?.[0].b64_json;
    console.log('IMAGE GENERATED');
    const imageUrl = `data:image/png;base64, ${imageB64}`;

    return Response.json({ url: imageUrl ?? '' });
  } catch (e) {
    console.log(e);
  }
}
