'use client';

import React from 'react';
import { PortfolioMessage } from '../../types';

interface PortfolioContentProps {
  message: PortfolioMessage;
}

const PortfolioContent: React.FC<PortfolioContentProps> = ({ message }) => {
  const { holdings, totalValue } = message;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatCrypto = (value: number, symbol: string) => {
    return `${value.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })} ${symbol.toUpperCase()}`;
  };

  return (
    <div className="space-y-3">
      <div className="font-medium">Your Portfolio</div>
      <div className="text-xl font-bold">
        Total Value: {formatCurrency(totalValue)}
      </div>
      
      {holdings.length > 0 ? (
        <div className="space-y-2">
          {holdings.map((holding) => (
            <div 
              key={holding.coinId} 
              className="flex justify-between p-2 rounded-lg bg-opacity-10 bg-gray-500 dark:bg-opacity-20"
            >
              <div>
                <div className="font-medium">{holding.name}</div>
                <div className="text-sm">{formatCrypto(holding.amount, holding.symbol)}</div>
              </div>
              <div className="text-right">
                <div>{formatCurrency(Number(holding.value))}</div>
                <div className="text-sm">
                  {formatCurrency(Number(holding.price))} per coin
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400">
          No holdings yet. Add some by typing "I have X amount of [coin]".
        </div>
      )}
    </div>
  );
};

export default PortfolioContent;