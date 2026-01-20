import { create } from 'zustand';
import { BinanceMiniTicker, CryptoCoin, CryptoStore } from '../types/binance';

function transformBinanceData(ticker: BinanceMiniTicker): CryptoCoin {
  const currentPrice = parseFloat(ticker.c);
  const openPrice = parseFloat(ticker.o);
  const priceChange = currentPrice - openPrice;
  const priceChangePercent = openPrice > 0 ? (priceChange / openPrice) * 100 : 0;

  return {
    symbol: ticker.s,
    currentPrice,
    previousPrice: currentPrice, // Will be updated on subsequent updates
    openPrice,
    highPrice: parseFloat(ticker.h),
    lowPrice: parseFloat(ticker.l),
    volume: ticker.v,
    priceChange,
    priceChangePercent,
    lastUpdate: ticker.E,
    priceDirection: 'neutral'
  };
}

export const useCryptoStore = create<CryptoStore>((set, get) => ({
  coins: {},
  isConnected: false,
  isConnecting: false,
  error: null,

  setCoins: (coins) => set({ coins }),

  updateCoin: (newCoin) => set((state) => {
    const existingCoin = state.coins[newCoin.symbol];
    let updatedCoin = { ...newCoin };
    
    if (existingCoin) {
      updatedCoin.previousPrice = existingCoin.currentPrice;
      
      // Determine price direction
      if (newCoin.currentPrice > existingCoin.currentPrice) {
        updatedCoin.priceDirection = 'up';
      } else if (newCoin.currentPrice < existingCoin.currentPrice) {
        updatedCoin.priceDirection = 'down';
      } else {
        updatedCoin.priceDirection = 'neutral';
      }
    }

    return {
      coins: {
        ...state.coins,
        [newCoin.symbol]: updatedCoin
      }
    };
  }),

  setConnectionStatus: ({ isConnected, isConnecting, error }) => 
    set({ isConnected, isConnecting, error }),

  reset: () => set({
    coins: {},
    isConnected: false,
    isConnecting: false,
    error: null
  })
}));

// Helper function to process Binance WebSocket data
export function processBinanceData(data: BinanceMiniTicker[]): Record<string, CryptoCoin> {
  const coins: Record<string, CryptoCoin> = {};
  
  data.forEach((ticker) => {
    // Filter only USDT pairs for better relevance
    if (ticker.s.endsWith('USDT')) {
      coins[ticker.s] = transformBinanceData(ticker);
    }
  });
  
  return coins;
}