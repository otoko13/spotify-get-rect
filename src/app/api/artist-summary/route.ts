import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        content: 'You are a writer for a music magazine.',
        role: 'system',
      },
      {
        content: `Write an entertaining, attention-grabbing summary about the music artist ${params.get(
          'artist',
        )}, in less than 200 words.`,
        role: 'user',
      },
    ],
    model: 'gpt-4o',
  });

  console.log('COMPLETION', completion);
  return Response.json(completion);
}
