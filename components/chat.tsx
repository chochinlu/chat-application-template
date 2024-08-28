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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SendIcon } from "@/components/SendIcon"
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;  // Add imageUrl property
}

// ChatMessage component modification
const ChatMessage = ({ isAI, avatarFallback, name, message, imageUrl }: {
  isAI: boolean;
  avatarFallback: string;
  name: string;
  message: React.ReactNode;
  imageUrl?: string;
}) => (
  <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
    <div className={`flex ${isAI ? 'flex-row' : 'flex-row-reverse'} max-w-[80%] items-start space-x-2`}>
      <Avatar className={isAI ? 'mr-2' : 'ml-2'}>
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className={`rounded-lg p-2 ${isAI ? 'bg-gray-200' : 'bg-gray-50 text-right'}`}>
        {imageUrl && (
          <div className="mb-2">
            <img
              src={imageUrl}
              alt="Attached"
              className="max-w-[400px] max-h-[400px] w-auto h-auto object-contain"
            />
          </div>
        )}
        <div>{message}</div>
      </div>
    </div>
  </div>
);

// Add an AttachmentIcon component
const AttachmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

// Modify CloseIcon component
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

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
        <div className="relative">
          {imageUrl && (
            <div className="absolute left-2 top-2 w-20 h-20 bg-gray-200 rounded overflow-hidden group">
              <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
              <button
                className="absolute top-0.5 right-0.5 bg-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveImage}
              >
                <CloseIcon />
              </button>
            </div>
          )}
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`w-full resize-none rounded-lg p-2 pr-24 border border-muted focus:border-primary focus:ring-primary ${imageUrl ? 'pt-24' : ''}`}
            rows={3}
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${imageUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleFileAttachment}
              disabled={!!imageUrl}
              title="Image upload only (max 5MB)"
            >
              <AttachmentIcon />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleSendMessage}>
              <SendIcon className="w-5 h-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
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
