export interface BinanceMiniTicker {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: string; // Close price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
}

export interface CryptoCoin {
  symbol: string;
  currentPrice: number;
  previousPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: string;
  priceChange: number;
  priceChangePercent: number;
  lastUpdate: number;
  priceDirection: 'up' | 'down' | 'neutral';
}

export interface CryptoStore {
  coins: Record<string, CryptoCoin>;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  setCoins: (coins: Record<string, CryptoCoin>) => void;
  updateCoin: (coin: CryptoCoin) => void;
  setConnectionStatus: (status: { isConnected: boolean; isConnecting: boolean; error: string | null }) => void;
  reset: () => void;
}