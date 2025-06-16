# Crypto Web Chat

A modern, interactive chat interface for cryptocurrency information powered by the CoinGecko API. This application allows users to get real-time cryptocurrency data through a conversational interface with text-to-speech capabilities.

# Architecture
![deepseek_mermaid_20250614_86a251](https://github.com/user-attachments/assets/c63467ea-62ec-4643-b5ea-e78a3a4266de)

## Features

- **Real-time Cryptocurrency Price Information**: Ask about any cryptocurrency price (e.g., "What's the price of Bitcoin?", "How much is ETH trading at?")
- **Trending Coins**: Get information about currently trending cryptocurrencies
- **Price Charts**: View historical price data for cryptocurrencies
- **Portfolio Management**: Track your cryptocurrency holdings and their current value
- **Voice Input**: Use speech recognition to interact with the chat interface
- **Text-to-Speech**: Listen to the assistant's responses with speech synthesis
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Next.js**: React framework for building the web application
- **TypeScript**: For type-safe code
- **CoinGecko API**: For cryptocurrency data
- **Recharts**: For rendering price charts
- **Web Speech API**: For speech recognition and synthesis
- **Tailwind CSS**: For styling
- **Geist Font**: For typography

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage Examples

You can interact with the chat by typing or speaking commands like:

- "What's the price of Bitcoin?"
- "Show me trending coins"
- "Show chart for Ethereum"
- "I have 2 ETH in my portfolio"
- "What's my portfolio worth?"

## Project Structure

- `/src/app`: Next.js app router files
- `/src/components`: React components including chat interface
- `/src/context`: React context for state management
- `/src/lib`: Utility functions and API calls
- `/src/types`: TypeScript type definitions

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [CoinGecko API](https://www.coingecko.com/en/api/documentation)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)


