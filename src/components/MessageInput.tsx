'use client';

import React, { useState, useRef } from 'react';
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isProcessing }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<typeof window.SpeechRecognition | null>(null);

  const handleSend = () => {
    if (message.trim() && !isProcessing) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionResult) => {
        const transcript = (event as unknown as { results: SpeechRecognitionResultList }).results[0][0].transcript;
        setMessage((prev) => prev + ' ' + transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: { error: string }) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <textarea
          className="w-full p-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
          placeholder="Type your message..."
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
        />
        {isProcessing && (
          <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 animate-pulse">
            thinking...
          </div>
        )}
      </div>
      
      <button
        className={`p-3 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        onClick={toggleRecording}
        disabled={isProcessing}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? <FiMicOff size={20} /> : <FiMic size={20} />}
      </button>
      
      <button
        className="p-3 rounded-full bg-blue-500 text-white disabled:opacity-50"
        onClick={handleSend}
        disabled={!message.trim() || isProcessing}
        aria-label="Send message"
      >
        <FiSend size={20} />
      </button>
    </div>
  );
};

export default MessageInput;

// Add type definition for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}