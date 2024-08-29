import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ReactNode } from 'react';

interface ChatMessageProps {
  isAI: boolean;
  avatarFallback: string;
  message: React.ReactNode;
  imageUrl?: string;
}

export function ChatMessage({ isAI, avatarFallback, message, imageUrl }: ChatMessageProps) {
  return (
    <div className="flex w-full">
      <div className="w-8 flex-shrink-0">
        {isAI && (
          <Avatar className="h-8 w-8">
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className={`flex flex-col flex-grow px-2 ${isAI ? 'items-start' : 'items-end'}`}>
        {!isAI && imageUrl && (
          <img
            src={imageUrl}
            alt="User uploaded"
            className="mt-2 max-w-[400px] max-h-[400px] w-auto h-auto rounded-lg object-contain"
          />
        )}
        <div className={`mt-1 p-2 rounded-lg max-w-[calc(100%-32px)] ${isAI ? 'bg-gray-100 text-left' : 'bg-gray-400 text-white text-right'
          }`}>
          {message}
        </div>
      </div>
      <div className="w-8 flex-shrink-0">
        {!isAI && (
          <Avatar className="h-8 w-8">
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
