/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/NYDyUGoHDaq
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
'use client'

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "@/components/ChatMessage"
import { SendIcon } from "@/components/SendIcon"
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I assist you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: inputMessage }
    ];

    setMessages(newMessages);
    setInputMessage('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, an error occurred.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-[1024px] border border-gray-400 rounded-lg">
      <div className="flex-1 overflow-auto p-4 space-y-4 w-full">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            isAI={msg.role === 'assistant'}
            avatarSrc={msg.role === 'assistant' ? "/ai-avatar.jpg" : "/user-avatar.jpg"}
            avatarFallback={msg.role === 'assistant' ? "AI" : "U"}
            name={msg.role === 'assistant' ? "AI" : "U"}
            message={msg.content}
          />
        ))}
        {isThinking && (
          <ChatMessage
            isAI={true}
            avatarSrc="/ai-avatar.jpg"
            avatarFallback="AI"
            name="AI"
            message={<span className="thinking">thinking...</span>}
          />
        )}
      </div>
      <div className="border-t p-2 flex items-center gap-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 resize-none rounded-lg p-2 border border-muted focus:border-primary focus:ring-primary"
        />
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleSendMessage}>
          <SendIcon className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
