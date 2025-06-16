/**
 * Types for the crypto web-chat application
 */

import { ReactNode } from "react";

/**
 * Detailed coin data
 */
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  priceChange24h: number;
  description: string;
}

/**
 * Trending coin data
 */
export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  marketCapRank: number;
  priceBtc: number;
}

/**
 * Price data point for charts
 */
export interface PriceDataPoint {
  timestamp: number;
  price: number;
}

/**
 * Value data point for charts (market cap, volume)
 */
export interface ValueDataPoint {
  timestamp: number;
  value: number;
}

/**
 * Market chart data
 */
export interface MarketChartData {
  prices: PriceDataPoint[];
  marketCaps: ValueDataPoint[];
  totalVolumes: ValueDataPoint[];
}

/**
 * User portfolio holding
 */
export interface Holding {
  price?: number;
  value?: number;
  name?: string;
  coinId: string;
  symbol: string;
  amount: number;
}

/**
 * Message sender type
 */
export type MessageSender = 'user' | 'assistant';

/**
 * Message content types
 */
export type MessageContentType = 'text' | 'price' | 'trending' | 'chart' | 'portfolio' | 'error';

/**
 * Base message interface
 */
export interface BaseMessage {
  id: string;
  sender: MessageSender;
  timestamp: Date;
  type: MessageContentType;
}

/**
 * Text message
 */
export interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
}

/**
 * Price message
 */
export interface PriceMessage extends BaseMessage {
  type: 'price';
  coinId: string;
  coinName: string;
  price: number;
  symbol?: string;
}

/**
 * Trending coins message
 */
export interface TrendingMessage extends BaseMessage {
  type: 'trending';
  coins: TrendingCoin[];
}

/**
 * Chart message
 */
export interface ChartMessage extends BaseMessage {
  type: 'chart';
  coinId: string;
  coinName: string;
  symbol?: string;
  chartData: PriceDataPoint[];
}

/**
 * Portfolio message
 */
export interface PortfolioMessage extends BaseMessage {
  type: 'portfolio';
  holdings: Holding[];
  totalValue: number;
}

/**
 * Error message
 */
export interface ErrorMessage extends BaseMessage {
  type: 'error';
  content: string;
}

/**
 * Union type for all message types
 */
export type Message = TextMessage | PriceMessage | TrendingMessage | ChartMessage | PortfolioMessage | ErrorMessage;