import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge' // if you decide to use edge runtime

export async function POST(req: Request) {
  try {
    const { messages, imageUrl } = await req.json();

    // Add system prompt
    const systemPrompt = {
      role: 'system',
      content: 'If the user uses Traditional Chinese, please respond in Traditional Chinese. For other languages, please respond in the corresponding language.'
    };

    let apiMessages = [systemPrompt, ...messages];

    // If there's an image, add it to the last user message
    if (imageUrl && apiMessages[apiMessages.length - 1].role === 'user') {
      apiMessages[apiMessages.length - 1].content = [
        { type: "text", text: apiMessages[apiMessages.length - 1].content },
        { type: "image_url", image_url: { url: imageUrl } }
      ];
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: apiMessages,
      stream: true,
      // max_tokens: 1000
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
