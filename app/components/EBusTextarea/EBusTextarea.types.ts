import React from 'react';

export interface EBusTextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  name?: string;
  id?: string;
  disabled?: boolean;
}
