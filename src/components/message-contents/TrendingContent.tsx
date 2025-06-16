'use client';

import React from 'react';
import Image from 'next/image';
import { TrendingMessage } from '../../types';

interface TrendingContentProps {
  message: TrendingMessage;
}

const TrendingContent: React.FC<TrendingContentProps> = ({ message }) => {
  const { coins } = message;

  return (
    <div className="space-y-3">
      <div className="font-medium">Trending Coins</div>
      <div className="space-y-2">
        {coins.slice(0, 5).map((coin) => (
          <div key={coin.id} className="flex items-center space-x-3 p-2 rounded-lg bg-opacity-10 bg-gray-500 dark:bg-opacity-20">
            <div className="relative w-8 h-8">
              {coin.image && (
                <Image 
                  src={coin.image} 
                  alt={coin.name} 
                  fill 
                  className="rounded-full object-cover" 
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">{coin.name}</span>
                <span className="text-sm">#{coin.marketCapRank}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{coin.symbol}</span>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'BTC',
                    minimumFractionDigits: 8,
                    maximumFractionDigits: 10
                  }).format(coin.priceBtc).replace('BTC', 'BTC')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingContent;