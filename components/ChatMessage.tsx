import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ReactNode } from 'react';
interface ChatMessageProps {
  isAI: boolean;
  avatarSrc: string;
  avatarFallback: string;
  name: string;
  message: ReactNode;
}

export function ChatMessage({ isAI, avatarSrc, avatarFallback, name, message }: ChatMessageProps) {
  return (
    <div className={`flex items-start gap-3 ${isAI ? '' : 'justify-end'}`}>
      {isAI && (
        <Avatar className="w-8 h-8 border">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      )}
      <div className={`rounded-lg p-3 max-w-[75%] ${isAI ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
        <div>{message}</div>
      </div>
      {!isAI && (
        <Avatar className="w-8 h-8 border">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
