import axios from 'axios';
import { CoinData, TrendingCoin, MarketChartData, PriceDataPoint } from '../types';

// Base URL for CoinGecko API
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Add a delay to prevent rate limiting during development
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get current price of a cryptocurrency
 */
export const getCoinPrice = async (coinId: string): Promise<CoinData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      }
    });
    
    return {
      id: response.data.id,
      symbol: response.data.symbol,
      name: response.data.name,
      image: response.data.image.small,
      currentPrice: response.data.market_data.current_price.usd,
      marketCap: response.data.market_data.market_cap.usd,
      priceChange24h: response.data.market_data.price_change_percentage_24h,
      description: response.data.description.en.split('. ')[0] + '.', // Just the first sentence
    };
  } catch (error) {
    console.error('Error fetching coin price:', error);
    throw new Error('Failed to fetch coin price');
  }
};

/**
 * Get trending cryptocurrencies
 */
export const getTrendingCoins = async (): Promise<TrendingCoin[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/trending`);
    
    return response.data.coins.map((item: any) => ({
      id: item.item.id,
      name: item.item.name,
      symbol: item.item.symbol,
      image: item.item.small,
      marketCapRank: item.item.market_cap_rank,
      priceBtc: item.item.price_btc
    }));
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw new Error('Failed to fetch trending coins');
  }
};

/**
 * Get market chart data for a cryptocurrency
 */
export const getMarketChart = async (coinId: string, days = 7): Promise<PriceDataPoint[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: 'daily'
      }
    });
    
    // Format the price data for the chart
    return response.data.prices.map((item: [number, number]) => ({
      timestamp: item[0],
      price: item[1]
    }));
  } catch (error) {
    console.error('Error fetching market chart:', error);
    throw new Error('Failed to fetch market chart');
  }
};

/**
 * Search for coins by query
 */
export const searchCoins = async (query: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query }
    });
    
    return response.data.coins.slice(0, 5); // Return top 5 results
  } catch (error) {
    console.error('Error searching coins:', error);
    throw new Error('Failed to search coins');
  }
};

/**
 * Get multiple coin prices by ID
 */
export const getMultipleCoinPrices = async (coinIds: string[]): Promise<Record<string, number>> => {
  if (coinIds.length === 0) return {};
  
  try {
    const response = await axios.get(`${API_BASE_URL}/simple/price`, {
      params: {
        ids: coinIds.join(','),
        vs_currencies: 'usd'
      }
    });
    
    const result: Record<string, number> = {};
    for (const coinId of coinIds) {
      if (response.data[coinId]) {
        result[coinId] = response.data[coinId].usd;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching multiple coin prices:', error);
    throw new Error('Failed to fetch coin prices');
  }
};