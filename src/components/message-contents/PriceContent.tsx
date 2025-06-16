'use client';

import React from 'react';
import { PriceMessage } from '../../types';

interface PriceContentProps {
  message: PriceMessage;
}

const PriceContent: React.FC<PriceContentProps> = ({ message }) => {
  const { coinName, price, symbol } = message;
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2
  }).format(price);

  return (
    <div className="space-y-2">
      <div className="font-medium">
        {coinName} {symbol && `(${symbol.toUpperCase()})`} Price
      </div>
      <div className="text-xl font-bold">{formattedPrice}</div>
    </div>
  );
};

export default PriceContent;