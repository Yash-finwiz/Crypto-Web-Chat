'use client';

import React from 'react';
import { ErrorMessage } from '../../types';

interface ErrorContentProps {
  message: ErrorMessage;
}

const ErrorContent: React.FC<ErrorContentProps> = ({ message }) => {
  return (
    <div className="text-red-500 dark:text-red-400">
      <div className="font-medium">Error</div>
      <div>{message.content}</div>
    </div>
  );
};

export default ErrorContent;