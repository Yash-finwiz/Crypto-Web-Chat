'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Holding, TextMessage } from '../types';
import { processMessage } from '../lib/messageProcessor';

interface ChatContextType {
  messages: Message[];
  isProcessing: boolean;
  holdings: Holding[];
  addUserMessage: (content: string) => void;
  updateHoldings: (holdings: Holding[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);

  // Load messages and holdings from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedHoldings = localStorage.getItem('userHoldings');
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDateObjects);
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
    
    if (savedHoldings) {
      try {
        setHoldings(JSON.parse(savedHoldings));
      } catch (error) {
        console.error('Failed to parse saved holdings:', error);
      }
    }
  }, []);

  // Save messages and holdings to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (holdings.length > 0) {
      localStorage.setItem('userHoldings', JSON.stringify(holdings));
    }
  }, [holdings]);

  const addUserMessage = async (content: string) => {
    // Create and add user message
    const userMessage: TextMessage = {
      id: uuidv4(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Process the message and get a response
      const response = await processMessage(content, holdings);
      
      // If the response includes updated holdings, update them
      if (response.updatedHoldings) {
        setHoldings(response.updatedHoldings);
      }
      
      // Add the assistant's response message
      setMessages(prev => [...prev, response.message]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add an error message
      const errorMessage: Message = {
        id: uuidv4(),
        sender: 'assistant',
        timestamp: new Date(),
        type: 'error',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateHoldings = (newHoldings: Holding[]) => {
    setHoldings(newHoldings);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isProcessing,
        holdings,
        addUserMessage,
        updateHoldings
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};