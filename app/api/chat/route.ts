import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge' // if you decide to use edge runtime

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Add system prompt
    const systemPrompt = {
      role: 'system',
      content: 'If the user uses Traditional Chinese, please respond in Traditional Chinese. For other languages, please respond in the corresponding language.'
    };

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemPrompt, ...messages],
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
