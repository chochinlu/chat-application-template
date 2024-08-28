import React from 'react';
import { Button } from "@/components/ui/button"
import { SendIcon } from "@/components/SendIcon"

interface SendButtonProps {
  handleSendMessage: () => void;
}

export const SendButton: React.FC<SendButtonProps> = ({ handleSendMessage }) => (
  <Button variant="ghost" size="icon" className="rounded-full" onClick={handleSendMessage}>
    <SendIcon className="w-5 h-5" />
    <span className="sr-only">Send</span>
  </Button>
);
