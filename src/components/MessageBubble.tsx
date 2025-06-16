'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { 
  TextContent,
  PriceContent,
  TrendingContent,
  ChartContent,
  PortfolioContent,
  ErrorContent 
} from './message-contents';

interface MessageBubbleProps {
  message: Message;
  speakMessage?: (text: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, speakMessage }) => {
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const bubbleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Speak assistant messages if speakMessage function is provided
    if (!isUser && speakMessage && message.type === 'text') {
      speakMessage(message.content);
    }
  }, [message, isUser, speakMessage]);
  
  // Determine content component based on message type
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <TextContent message={message} />;
      case 'price':
        return <PriceContent message={message} />;
      case 'trending':
        return <TrendingContent message={message} />;
      case 'chart':
        return <ChartContent message={message} />;
      case 'portfolio':
        return <PortfolioContent message={message} />;
      case 'error':
        return <ErrorContent message={message} />;
      default:
        return <div>Unknown message type</div>;
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-2xl p-4 ${isUser 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'}`}
      >
        {renderContent()}
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;