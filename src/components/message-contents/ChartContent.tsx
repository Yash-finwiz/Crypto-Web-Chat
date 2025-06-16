'use client';

import React from 'react';
import { ChartMessage } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartContentProps {
  message: ChartMessage;
}

const ChartContent: React.FC<ChartContentProps> = ({ message }) => {
  const { coinName, chartData, symbol } = message;

  // Format data for the chart
  const formattedData = chartData.map((dataPoint) => ({
    date: new Date(dataPoint.timestamp).toLocaleDateString(),
    price: dataPoint.price,
  }));

  // Calculate min and max for Y axis
  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.95; // 5% buffer below min
  const maxPrice = Math.max(...prices) * 1.05; // 5% buffer above max

  // Format price for tooltip
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  return (
    <div className="space-y-3">
      <div className="font-medium">
        {coinName} {symbol && `(${symbol.toUpperCase()})`} 7-Day Price Chart
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickMargin={10} 
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              tick={{ fontSize: 12 }} 
              tickMargin={10} 
              tickFormatter={(value) => formatPrice(value)}
            />
            <Tooltip 
              formatter={(value: number) => [formatPrice(value), 'Price']} 
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartContent;