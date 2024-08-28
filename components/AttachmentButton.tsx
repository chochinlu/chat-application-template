import React from 'react';
import { Button } from "@/components/ui/button"
import { AttachmentIcon } from './Icons';

interface AttachmentButtonProps {
  imageUrl: string | null;
  handleFileAttachment: () => void;
}

export const AttachmentButton: React.FC<AttachmentButtonProps> = ({ imageUrl, handleFileAttachment }) => (
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
);
