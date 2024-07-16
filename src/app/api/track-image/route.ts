import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  organization: 'org-s63ZpSumEt4Yd88NqZhK3vSi',
  project: 'proj_gddFkp48WXYWLJu9dY3xbiip',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  //   const completion = await openai.chat.completions.create({
  //     messages: [
  //       {
  //         role: 'system',
  //         content:
  //           'You are an artist specializing in creating art for the music industry.',
  //       },
  //       {
  //         role: 'user',
  //         content: `Create a 512x512px ${
  //           params.get('style') ?? 'comic book'
  //         } painting representing the lyrics to the song "${params.get(
  //           'song',
  //         )}" by ${params.get('artist')}.`,
  //       },
  //     ],
  //     model: 'gpt-4o',
  //   });

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Create a ${
      params.get('style') ?? 'comic book'
    } painting representing the lyrics to the song "${params.get(
      'song',
    )}" by ${params.get('artist')}.`,
    n: 1,
    size: '1024x1024',
  });
  const image_url = response.data[0].url;

  console.log(image_url);
  return Response.json(response);
}
