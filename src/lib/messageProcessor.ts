import { v4 as uuidv4 } from 'uuid';
import { Message, Holding, TextMessage, PriceMessage, TrendingMessage, ChartMessage, PortfolioMessage, ErrorMessage } from '../types';
import { getCoinPrice, getTrendingCoins, getMarketChart, searchCoins, getMultipleCoinPrices } from './api';

interface ProcessedMessage {
  message: Message;
  updatedHoldings?: Holding[];
}

/**
 * Process a user message and generate an appropriate response
 */
export const processMessage = async (content: string, holdings: Holding[]): Promise<ProcessedMessage> => {
  const normalizedContent = content.toLowerCase().trim();
  
  try {
    // Check for price requests
    if (normalizedContent.includes('price') || normalizedContent.includes('trading at') || normalizedContent.match(/how much is|what's the price of|what is the price of|how much does .* cost/)) {
      return await handlePriceRequest(normalizedContent);
    }
    
    // Check for trending coins request
    if (normalizedContent.includes('trending') || normalizedContent.includes('popular coins') || normalizedContent.includes('top coins')) {
      return await handleTrendingRequest();
    }
    
    // Check for chart requests
    if (normalizedContent.includes('chart') || normalizedContent.includes('graph') || normalizedContent.includes('price history')) {
      return await handleChartRequest(normalizedContent);
    }
    
    // Check for portfolio updates
    if (normalizedContent.includes('i have') || normalizedContent.includes('my portfolio') || normalizedContent.match(/add|bought|purchased|own|holding/)) {
      return await handlePortfolioRequest(normalizedContent, holdings);
    }
    
    // Check for portfolio value request
    if (normalizedContent.includes('portfolio value') || normalizedContent.includes('my holdings') || normalizedContent.includes('what am i holding')) {
      return await handlePortfolioValueRequest(holdings);
    }
    
    // Default response for unrecognized requests
    return {
      message: createTextMessage(
        'I can help you with cryptocurrency information. You can ask about prices, trending coins, charts, or manage your portfolio.'
      )
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      message: createErrorMessage('Sorry, I encountered an error processing your request. This might be due to API rate limiting or a network issue. Please try again in a moment.')
    };
  }
};

/**
 * Handle requests for cryptocurrency prices
 */
async function handlePriceRequest(content: string): Promise<ProcessedMessage> {
  // Extract coin name/symbol from the message
  let coinId = 'bitcoin'; // Default to bitcoin
  
  // Common coins to check for
  const coinKeywords = {
    'bitcoin': ['bitcoin', 'btc'],
    'ethereum': ['ethereum', 'eth'],
    'ripple': ['ripple', 'xrp'],
    'cardano': ['cardano', 'ada'],
    'solana': ['solana', 'sol'],
    'dogecoin': ['dogecoin', 'doge'],
    'polkadot': ['polkadot', 'dot'],
    'litecoin': ['litecoin', 'ltc']
  };
  
  // Check for coin mentions
  for (const [id, keywords] of Object.entries(coinKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      coinId = id;
      break;
    }
  }
  
  // If no known coin was found, try to search for it
  if (coinId === 'bitcoin' && !content.includes('bitcoin') && !content.includes('btc')) {
    const words = content.split(/\s+/);
    const searchResults = await searchCoins(words[words.length - 1]);
    
    if (searchResults.length > 0) {
      coinId = searchResults[0].id;
    }
  }
  
  try {
    const coinData = await getCoinPrice(coinId);
    
    const priceMessage: PriceMessage = {
      id: uuidv4(),
      sender: 'assistant',
      timestamp: new Date(),
      type: 'price',
      coinId: coinData.id,
      coinName: coinData.name,
      symbol: coinData.symbol,
      price: coinData.currentPrice
    };
    
    return { message: priceMessage };
  } catch (error) {
    return {
      message: createErrorMessage('Sorry, I couldn\'t find price information for that cryptocurrency.')
    };
  }
}

/**
 * Handle requests for trending coins
 */
async function handleTrendingRequest(): Promise<ProcessedMessage> {
  const trendingCoins = await getTrendingCoins();
  
  const trendingMessage: TrendingMessage = {
    id: uuidv4(),
    sender: 'assistant',
    timestamp: new Date(),
    type: 'trending',
    coins: trendingCoins
  };
  
  return { message: trendingMessage };
}

/**
 * Handle requests for price charts
 */
async function handleChartRequest(content: string): Promise<ProcessedMessage> {
  // Extract coin name/symbol from the message (similar to price request)
  let coinId = 'bitcoin'; // Default to bitcoin
  
  // Common coins to check for
  const coinKeywords = {
    'bitcoin': ['bitcoin', 'btc'],
    'ethereum': ['ethereum', 'eth'],
    'ripple': ['ripple', 'xrp'],
    'cardano': ['cardano', 'ada'],
    'solana': ['solana', 'sol'],
    'dogecoin': ['dogecoin', 'doge'],
    'polkadot': ['polkadot', 'dot'],
    'litecoin': ['litecoin', 'ltc']
  };
  
  // Check for coin mentions
  for (const [id, keywords] of Object.entries(coinKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      coinId = id;
      break;
    }
  }
  
  // If no known coin was found, try to search for it
  if (coinId === 'bitcoin' && !content.includes('bitcoin') && !content.includes('btc')) {
    const words = content.split(/\s+/);
    const searchResults = await searchCoins(words[words.length - 1]);
    
    if (searchResults.length > 0) {
      coinId = searchResults[0].id;
    }
  }
  
  try {
    const [chartData, coinData] = await Promise.all([
      getMarketChart(coinId),
      getCoinPrice(coinId)
    ]);
    
    const chartMessage: ChartMessage = {
      id: uuidv4(),
      sender: 'assistant',
      timestamp: new Date(),
      type: 'chart',
      coinId: coinData.id,
      coinName: coinData.name,
      symbol: coinData.symbol,
      chartData: chartData
    };
    
    return { message: chartMessage };
  } catch (error) {
    return {
      message: createErrorMessage('Sorry, I couldn\'t generate a chart for that cryptocurrency.')
    };
  }
}

/**
 * Handle portfolio-related requests
 */
async function handlePortfolioRequest(content: string, currentHoldings: Holding[]): Promise<ProcessedMessage> {
  // Extract coin and amount information
  const match = content.match(/i have (\d+(?:\.\d+)?)\s+([a-zA-Z]+)/i) || 
                content.match(/add (\d+(?:\.\d+)?)\s+([a-zA-Z]+)/i) ||
                content.match(/bought (\d+(?:\.\d+)?)\s+([a-zA-Z]+)/i);
  
  if (!match) {
    return {
      message: createTextMessage('To add holdings to your portfolio, please specify the amount and cryptocurrency (e.g., "I have 2 ETH" or "Add 0.5 BTC").')
    };
  }
  
  const amount = parseFloat(match[1]);
  const symbol = match[2].toLowerCase();
  
  // Map common symbols to coin IDs
  const symbolToCoinId: Record<string, string> = {
    'btc': 'bitcoin',
    'eth': 'ethereum',
    'xrp': 'ripple',
    'ada': 'cardano',
    'sol': 'solana',
    'doge': 'dogecoin',
    'dot': 'polkadot',
    'ltc': 'litecoin'
  };
  
  let coinId = symbolToCoinId[symbol] || symbol;
  
  // If not a common symbol, search for it
  if (!symbolToCoinId[symbol]) {
    const searchResults = await searchCoins(symbol);
    if (searchResults.length > 0) {
      coinId = searchResults[0].id;
    }
  }
  
  try {
    // Get the current price of the coin
    const coinData = await getCoinPrice(coinId);
    
    // Create or update the holding
    const updatedHoldings = [...currentHoldings];
    const existingHoldingIndex = updatedHoldings.findIndex(h => h.coinId === coinId);
    
    if (existingHoldingIndex >= 0) {
      // Update existing holding
      updatedHoldings[existingHoldingIndex] = {
        ...updatedHoldings[existingHoldingIndex],
        amount: amount, // Replace with new amount
        price: coinData.currentPrice,
        value: amount * coinData.currentPrice,
        name: coinData.name
      };
    } else {
      // Add new holding
      updatedHoldings.push({
        coinId,
        symbol: coinData.symbol,
        amount,
        price: coinData.currentPrice,
        value: amount * coinData.currentPrice,
        name: coinData.name
      });
    }
    
    // Calculate total portfolio value
    const totalValue = updatedHoldings.reduce((sum, holding) => sum + (holding.value || 0), 0);
    
    const portfolioMessage: PortfolioMessage = {
      id: uuidv4(),
      sender: 'assistant',
      timestamp: new Date(),
      type: 'portfolio',
      holdings: updatedHoldings,
      totalValue
    };
    
    return { 
      message: portfolioMessage,
      updatedHoldings
    };
  } catch (error) {
    return {
      message: createErrorMessage('Sorry, I couldn\'t add that cryptocurrency to your portfolio. Please check the symbol and try again.')
    };
  }
}

/**
 * Handle requests to view portfolio value
 */
async function handlePortfolioValueRequest(holdings: Holding[]): Promise<ProcessedMessage> {
  if (holdings.length === 0) {
    return {
      message: createTextMessage('You don\'t have any holdings in your portfolio yet. You can add holdings by saying something like "I have 2 ETH".')
    };
  }
  
  try {
    // Get current prices for all holdings
    const coinIds = holdings.map(h => h.coinId);
    const prices = await getMultipleCoinPrices(coinIds);
    
    // Update holdings with current prices and values
    const updatedHoldings = holdings.map(holding => ({
      ...holding,
      price: prices[holding.coinId] || holding.price,
      value: holding.amount * (prices[holding.coinId] || (holding.price || 0))
    }));
    
    // Calculate total portfolio value
    const totalValue = updatedHoldings.reduce((sum, holding) => sum + (holding.value || 0), 0);
    
    const portfolioMessage: PortfolioMessage = {
      id: uuidv4(),
      sender: 'assistant',
      timestamp: new Date(),
      type: 'portfolio',
      holdings: updatedHoldings,
      totalValue
    };
    
    return { 
      message: portfolioMessage,
      updatedHoldings
    };
  } catch (error) {
    return {
      message: createErrorMessage('Sorry, I couldn\'t retrieve your portfolio value at the moment. Please try again later.')
    };
  }
}

/**
 * Create a text message from the assistant
 */
function createTextMessage(content: string): TextMessage {
  return {
    id: uuidv4(),
    sender: 'assistant',
    timestamp: new Date(),
    type: 'text',
    content
  };
}

/**
 * Create an error message
 */
function createErrorMessage(content: string): ErrorMessage {
  return {
    id: uuidv4(),
    sender: 'assistant',
    timestamp: new Date(),
    type: 'error',
    content
  };
}