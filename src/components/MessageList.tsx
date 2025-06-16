'use client';

import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  speakMessage?: (text: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, speakMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <h3 className="text-lg font-medium">Welcome to Crypto Chat!</h3>
            <p className="mt-2">
              Ask me about cryptocurrency prices, trending coins, or your portfolio.
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            speakMessage={speakMessage}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;