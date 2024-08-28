import React, { FC } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { AttachmentButton } from './AttachmentButton';
import { SendButton } from './SendButton';
import { CloseIcon } from './Icons';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  imageUrl: string | null;
  handleFileAttachment: () => void;
  handleSendMessage: () => void;
  handleRemoveImage: () => void;
  AttachmentIcon: FC;
  CloseIcon: FC;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  handleKeyDown,
  imageUrl,
  handleFileAttachment,
  handleSendMessage,
  handleRemoveImage,
  AttachmentIcon,
  CloseIcon
}) => (
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
      <AttachmentButton imageUrl={imageUrl} handleFileAttachment={handleFileAttachment} />
      <SendButton handleSendMessage={handleSendMessage} />
    </div>
  </div>
);
