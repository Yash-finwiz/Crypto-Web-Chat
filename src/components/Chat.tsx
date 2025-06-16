'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat: React.FC = () => {
  const { messages, isProcessing, addUserMessage } = useChat();
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      setIsSpeechEnabled(true);
    }
    
    return () => {
      // Cancel any ongoing speech when component unmounts
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Function to speak text using speech synthesis
  const speakMessage = (text: string) => {
    if (speechSynthesisRef.current && isSpeechEnabled) {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Speak the text
      speechSynthesisRef.current.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          speakMessage={isSpeechEnabled ? speakMessage : undefined}
        />
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <MessageInput 
          onSendMessage={addUserMessage} 
          isProcessing={isProcessing} 
        />
      </div>
    </div>
  );
};

export default Chat;