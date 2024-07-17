import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  organization: 'org-s63ZpSumEt4Yd88NqZhK3vSi',
  project: 'proj_gddFkp48WXYWLJu9dY3xbiip',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a writer for a music magazine.',
      },
      {
        role: 'user',
        content: `Write an entertaining, attention-grabbing summary about the music artist ${params.get(
          'artist',
        )}, in less than 200 words.`,
      },
    ],
    model: 'gpt-4o',
  });

  console.log(`\n\n\n${completion}\n\n\n`);
  return Response.json(completion);
}
