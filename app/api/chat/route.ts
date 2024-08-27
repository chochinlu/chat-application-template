import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
