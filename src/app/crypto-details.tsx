import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Button, HStack, MarketTrendChart, SafeAreaView, StatusBar, Text, View, VStack } from '../components/ui';
import { useCryptoStore } from '../stores/useCryptoStore';

export default function CryptoDetails() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const router = useRouter();
  const { coins } = useCryptoStore();
  
  const coin = coins[symbol as string];

  // Generate detailed chart data (48 hours simulation)
  const detailedChartData = useMemo(() => {
    if (!coin) return [];
    
    const data = [];
    const changePercent = coin.priceChangePercent;
    const baseValue = 50;
    
    // Generate 48 points for detailed view
    for (let i = 0; i < 48; i++) {
      const progress = i / 47;
      const trendValue = baseValue + (changePercent * progress * 0.4);
      const volatility = (Math.sin(i * 0.3) * 3) + (Math.random() - 0.5) * 2;
      const finalValue = trendValue + volatility;
      
      data.push({
        x: i + 1,
        y: Math.max(20, Math.min(80, finalValue)),
        label: i % 4 === 0 ? `${Math.floor(i / 2)}h` : undefined
      });
    }
    
    return data;
  }, [coin]);

  if (!coin) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <Text className="text-white text-lg">Criptomoeda não encontrada</Text>
      </View>
    );
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const formatMarketCap = (volume: string) => {
    const vol = parseFloat(volume);
    if (vol > 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
    if (vol > 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
    if (vol > 1e3) return `$${(vol / 1e3).toFixed(2)}K`;
    return `$${vol.toFixed(2)}`;
  };

  const priceChangeColor = coin.priceChange > 0 ? '#10B981' : coin.priceChange < 0 ? '#EF4444' : '#6B7280';
  const chartColor = coin.priceChange > 0 ? '#10B981' : '#3B82F6';

  return (
    <View className="flex-1 bg-slate-900">
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Header */}
        <View className="px-4 py-6 border-b border-slate-700">
          <HStack className="justify-between items-center">
            <Button onPress={() => router.back()} className="bg-slate-800 rounded-lg p-2">
              <ArrowLeft size={20} color="#FFFFFF" />
            </Button>
            <VStack className="items-center">
              <Text className="text-white text-xl font-bold">
                {coin.symbol.replace('USDT', '')}
              </Text>
              <Text className="text-slate-400 text-sm">
                {coin.symbol}
              </Text>
            </VStack>
            <View className="w-10" />
          </HStack>
        </View>

        {/* Price Section */}
        <View className="px-4 py-6">
          <VStack space="md" className="items-center">
            <Text className="text-white text-4xl font-bold">
              ${formatPrice(coin.currentPrice)}
            </Text>
            <HStack space="sm" className="items-center">
              {coin.priceChange > 0 ? (
                <TrendingUp size={20} color={priceChangeColor} />
              ) : coin.priceChange < 0 ? (
                <TrendingDown size={20} color={priceChangeColor} />
              ) : (
                <Activity size={20} color={priceChangeColor} />
              )}
              <Text 
                className="text-lg font-semibold"
                style={{ color: priceChangeColor }}
              >
                ${Math.abs(coin.priceChange).toFixed(4)} ({coin.priceChange > 0 ? '+' : ''}{coin.priceChangePercent.toFixed(2)}%)
              </Text>
            </HStack>
          </VStack>
        </View>

        {/* Chart */}
        <View className="px-4 mb-6">
          <VStack space="sm">
            <Text className="text-white text-lg font-semibold">Gráfico 48h</Text>
            <MarketTrendChart
              data={detailedChartData}
              title=""
              color={chartColor}
              width={360}
              height={200}
            />
          </VStack>
        </View>

        {/* Stats Grid */}
        <View className="px-4">
          <VStack space="md">
            <Text className="text-white text-lg font-semibold">Estatísticas</Text>
            
            <VStack space="sm">
              {/* Row 1 */}
              <HStack className="justify-between">
                <View className="flex-1 bg-slate-800 rounded-xl p-4 mr-2">
                  <Text className="text-slate-400 text-sm">Preço de Abertura</Text>
                  <Text className="text-white text-lg font-semibold">
                    ${formatPrice(coin.openPrice)}
                  </Text>
                </View>
                <View className="flex-1 bg-slate-800 rounded-xl p-4 ml-2">
                  <Text className="text-slate-400 text-sm">Volume 24h</Text>
                  <Text className="text-white text-lg font-semibold">
                    {formatMarketCap(coin.volume)}
                  </Text>
                </View>
              </HStack>

              {/* Row 2 */}
              <HStack className="justify-between">
                <View className="flex-1 bg-slate-800 rounded-xl p-4 mr-2">
                  <Text className="text-slate-400 text-sm">Máxima 24h</Text>
                  <Text className="text-white text-lg font-semibold">
                    ${formatPrice(coin.highPrice)}
                  </Text>
                </View>
                <View className="flex-1 bg-slate-800 rounded-xl p-4 ml-2">
                  <Text className="text-slate-400 text-sm">Mínima 24h</Text>
                  <Text className="text-white text-lg font-semibold">
                    ${formatPrice(coin.lowPrice)}
                  </Text>
                </View>
              </HStack>

              {/* Row 3 */}
              <View className="bg-slate-800 rounded-xl p-4">
                <Text className="text-slate-400 text-sm mb-2">Range de Preço 24h</Text>
                <View className="mb-2">
                  <HStack className="justify-between">
                    <Text className="text-slate-300 text-sm">${formatPrice(coin.lowPrice)}</Text>
                    <Text className="text-slate-300 text-sm">${formatPrice(coin.highPrice)}</Text>
                  </HStack>
                </View>
                <View className="h-2 bg-slate-700 rounded-full">
                  <View 
                    className="h-full bg-blue-400 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, 
                        ((coin.currentPrice - coin.lowPrice) / (coin.highPrice - coin.lowPrice)) * 100
                      ))}%`
                    }}
                  />
                </View>
                <Text className="text-slate-400 text-xs mt-1 text-center">
                  Posição atual: {formatPrice(coin.currentPrice)}
                </Text>
              </View>
            </VStack>
          </VStack>
        </View>
      </SafeAreaView>
    </View>
  );
}