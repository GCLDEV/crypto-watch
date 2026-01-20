import { useCallback, useEffect, useRef } from 'react';
import { processBinanceData, useCryptoStore } from '../stores/useCryptoStore';
import { BinanceMiniTicker } from '../types/binance';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/!miniTicker@arr';
const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

export function useBinanceWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualClose = useRef(false);

  const { setConnectionStatus, updateCoin } = useCryptoStore();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus({
      isConnected: false,
      isConnecting: true,
      error: null
    });

    try {
      ws.current = new WebSocket(BINANCE_WS_URL);

      ws.current.onopen = () => {
        console.log('✅ WebSocket conectado ao Binance');
        reconnectAttempts.current = 0;
        setConnectionStatus({
          isConnected: true,
          isConnecting: false,
          error: null
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const data: BinanceMiniTicker[] = JSON.parse(event.data);
          
          // Process and update coins individually for better performance
          data.forEach((ticker) => {
            if (ticker.s.endsWith('USDT')) {
              const coinData = processBinanceData([ticker]);
              const coin = coinData[ticker.s];
              if (coin) {
                updateCoin(coin);
              }
            }
          });
        } catch (error) {
          console.error('❌ Erro ao processar dados do WebSocket:', error);
        }
      };

      ws.current.onclose = (event) => {
        setConnectionStatus({
          isConnected: false,
          isConnecting: false,
          error: null
        });

        if (!isManualClose.current && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          console.log(`🔄 WebSocket desconectado. Tentativa de reconexão ${reconnectAttempts.current + 1}/${MAX_RECONNECT_ATTEMPTS}`);
          reconnectAttempts.current++;
          
          reconnectTimeoutId.current = setTimeout(() => {
            connect();
          }, RECONNECT_INTERVAL);
        } else if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
          setConnectionStatus({
            isConnected: false,
            isConnecting: false,
            error: 'Falha na conexão após múltiplas tentativas'
          });
        }
      };

      ws.current.onerror = (error) => {
        console.error('❌ Erro no WebSocket:', error);
        setConnectionStatus({
          isConnected: false,
          isConnecting: false,
          error: 'Erro de conexão com o servidor'
        });
      };
    } catch (error) {
      console.error('❌ Erro ao criar WebSocket:', error);
      setConnectionStatus({
        isConnected: false,
        isConnecting: false,
        error: 'Falha ao conectar com o servidor'
      });
    }
  }, [setConnectionStatus, updateCoin]);

  const disconnect = useCallback(() => {
    isManualClose.current = true;
    
    if (reconnectTimeoutId.current) {
      clearTimeout(reconnectTimeoutId.current);
      reconnectTimeoutId.current = null;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    setConnectionStatus({
      isConnected: false,
      isConnecting: false,
      error: null
    });
  }, [setConnectionStatus]);

  const reconnect = useCallback(() => {
    disconnect();
    isManualClose.current = false;
    reconnectAttempts.current = 0;
    setTimeout(connect, 1000);
  }, [connect, disconnect]);

  useEffect(() => {
    isManualClose.current = false;
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connect,
    disconnect,
    reconnect
  };
}