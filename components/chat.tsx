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

import { useState, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import ReactMarkdown from 'react-markdown';
import { AttachmentIcon, CloseIcon } from './Icons';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I assist you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const handleFileAttachment = () => {
    if (!imageUrl) {
      fileInputRef.current?.click();
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setReminderMessage('File size cannot exceed 5MB.');
        return;
      }
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
          setReminderMessage(null); // Clear reminder message
        };
        reader.readAsDataURL(file);
      } else {
        setReminderMessage('Please upload only image files.');
      }
    }
    // If the file is not an image, we don't perform any action and don't display a warning
  }

  const handleRemoveImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !imageUrl) return;

    setReminderMessage(null); // Clear reminder message

    const newMessage: Message = {
      role: 'user',
      content: inputMessage,
      imageUrl: imageUrl || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsThinking(true);

    console.log('Sending message with imageUrl:', imageUrl ? imageUrl.substring(0, 50) + '...' : 'undefined');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newMessage], imageUrl }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let aiResponse = '';
      setIsThinking(false);
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        aiResponse += text;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = aiResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred.' }]);
    } finally {
      setIsThinking(false);
      setImageUrl(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey) {
        setInputMessage(prev => prev + '\n');
      } else if (!e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-[1024px] border border-gray-400 rounded-lg">
      <div className="flex-1 overflow-auto p-4 space-y-4 w-full">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            isAI={msg.role === 'assistant'}
            avatarFallback={msg.role === 'assistant' ? "AI" : "U"}
            name={msg.role === 'assistant' ? "AI" : "User"}
            message={
              msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )
            }
            imageUrl={msg.imageUrl}
          />
        ))}
        {isThinking && (
          <ChatMessage
            isAI={true}
            avatarFallback="AI"
            name="AI"
            message={<span className="thinking">Thinking...</span>}
          />
        )}
      </div>
      <div className="border-t p-2">
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleKeyDown={handleKeyDown}
          imageUrl={imageUrl}
          handleFileAttachment={handleFileAttachment}
          handleSendMessage={handleSendMessage}
          handleRemoveImage={handleRemoveImage}
          AttachmentIcon={AttachmentIcon}
          CloseIcon={CloseIcon}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      {reminderMessage && (
        <div className="mt-2 text-sm text-red-500">
          {reminderMessage}
        </div>
      )}
    </div>
  );
}
