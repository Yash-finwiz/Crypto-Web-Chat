import { ChatProvider } from '../context/ChatContext';
import Chat from '../components/Chat';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Crypto Web Chat</h1>
          <div className="text-sm">Powered by CoinGecko API</div>
        </div>
      </header>
      
      <div className="flex-1 p-4">
        <ChatProvider>
          <Chat />
        </ChatProvider>
      </div>
    </main>
  )
}
