'use client';

import React from 'react';
import { TextMessage } from '../../types';

interface TextContentProps {
  message: TextMessage;
}

const TextContent: React.FC<TextContentProps> = ({ message }) => {
  return (
    <div className="whitespace-pre-wrap">{message.content}</div>
  );
};

export default TextContent;