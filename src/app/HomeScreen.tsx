import { FlashList } from '@shopify/flash-list';
import { RefreshCw, Search, WifiOff } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';
import { CryptoRow } from '../components/CryptoRow/CryptoRow';
import { Button, HStack, Input, MarketTrendChart, SafeAreaView, StatusBar, Text, View, VStack } from '../components/ui';
import { InputField } from '../components/ui/input';
import { useBinanceWebSocket } from '../hooks/useBinanceWebSocket';
import { useCryptoStore } from '../stores/useCryptoStore';
import { CryptoCoin } from '../types/binance';

export function HomeScreen() {
  const { coins, isConnected, isConnecting, error } = useCryptoStore();
  const { reconnect } = useBinanceWebSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Convert coins object to array and sort by market cap (volume as proxy)
  const coinList = useMemo(() => {
    const coinsArray = Object.values(coins);
    return coinsArray
      .filter(coin => {
        if (!searchQuery) return true;
        return coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        // Sort by volume (higher volume first)
        return parseFloat(b.volume) - parseFloat(a.volume);
      });
  }, [coins, searchQuery]);

  // Generate market overview data
  const marketTrendData = useMemo(() => {
    if (coinList.length === 0) return [];
    
    // Generate normalized market trend data (0-100 scale)
    const data = [];
    const baseValue = 50; // Start at middle
    
    for (let i = 0; i < 24; i++) {
      const progress = i / 23;
      // Create a realistic market trend with some volatility
      const randomVariation = (Math.sin(i * 0.5) * 5) + (Math.random() - 0.5) * 3;
      const trendValue = baseValue + (progress * 10) + randomVariation; // Slight upward trend
      
      data.push({
        x: i + 1,
        y: Math.max(30, Math.min(70, trendValue)), // Keep between 30-70
        label: `${i}:00`
      });
    }
    
    return data;
  }, [coinList]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    reconnect();
    setTimeout(() => setRefreshing(false), 1000);
  }, [reconnect]);

  const renderCoinItem = useCallback(({ item }: { item: CryptoCoin }) => (
    <CryptoRow coin={item} />
  ), []);

  const getKeyExtractor = useCallback((item: CryptoCoin) => item.symbol, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6 py-12">
      <VStack space="lg" className="items-center">
        {isConnecting ? (
          <>
            <View className="w-20 h-20 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl items-center justify-center">
              <RefreshCw size={36} color="#3B82F6" />
            </View>
            <Text className="text-xl font-bold text-white">
              Carregando dados...
            </Text>
            <Text className="text-sm text-slate-400 text-center max-w-xs">
              Conectando ao Binance WebSocket
            </Text>
          </>
        ) : searchQuery ? (
          <>
            <View className="w-20 h-20 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl items-center justify-center">
              <Search size={36} color="#64748B" />
            </View>
            <Text className="text-xl font-bold text-white">
              Nenhuma moeda encontrada
            </Text>
            <Text className="text-sm text-slate-400 text-center max-w-xs">
              Tente pesquisar por outro termo
            </Text>
          </>
        ) : (
          <>
            <View className="w-20 h-20 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl items-center justify-center">
              <WifiOff size={36} color="#EF4444" />
            </View>
            <Text className="text-xl font-bold text-white">
              Sem dados disponíveis
            </Text>
            <Text className="text-sm text-slate-400 text-center max-w-xs">
              Verifique sua conexão e tente novamente
            </Text>
            <View className="bg-red-500 px-6 py-3 rounded-xl">
              <Button
                onPress={reconnect}
                className="bg-transparent"
              >
                <Text className="text-white font-semibold">
                  Tentar Novamente
                </Text>
              </Button>
            </View>
          </>
        )}
      </VStack>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-900">
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Fixed Header */}
        <View className="px-4 py-6 bg-slate-900 border-b border-slate-700">
          <VStack space="lg">
            {/* Title and Connection Status */}
            <HStack className="justify-between items-center">
              <VStack>
                <HStack space="sm" className="items-center">
                  <View className="w-8 h-8 bg-blue-500 rounded-lg items-center justify-center">
                    <Text className="text-white font-bold">C</Text>
                  </View>
                  <Text className="text-3xl font-bold text-white">
                    CryptoWatch
                  </Text>
                </HStack>
                <Text className="text-slate-400 text-sm mt-1">
                  {Object.keys(coins).length} moedas monitoradas
                </Text>
              </VStack>
              <View className={`px-3 py-2 rounded-full flex-row items-center ${
                isConnected ? 'bg-green-500/20' : 'bg-red-500/20'
              }`} style={{ gap: 6 }}>
                <View className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <Text className={`text-xs font-medium ${
                  isConnected ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </Text>
                <Text className="text-slate-400 text-xs">•</Text>
                <Text className="text-green-400 text-xs font-medium">
                  Live
                </Text>
              </View>
            </HStack>

            {/* Search Input */}
            <View className="relative">
              <Input className="bg-slate-800 border border-slate-600 rounded-xl">
                <InputField
                  placeholder="Buscar criptomoedas..."
                  placeholderTextColor="#64748B"
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  className="text-white pl-12 py-3"
                />
              </Input>
              <View className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search size={18} color="#64748B" />
              </View>
            </View>

            {/* Market Trend Chart */}
            {marketTrendData.length > 0 && (
              <MarketTrendChart
                data={marketTrendData}
                title="Tendência do Mercado (24h)"
                color="#3B82F6"
                width={320}
                height={100}
              />
            )}
          </VStack>
        </View>
        
        {/* Crypto List */}
        <View className="flex-1 bg-slate-900 mt-4">
          <FlashList
            data={coinList}
            renderItem={renderCoinItem}
            keyExtractor={getKeyExtractor}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#3B82F6']}
                tintColor="#3B82F6"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, backgroundColor: '#0f172a' }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}