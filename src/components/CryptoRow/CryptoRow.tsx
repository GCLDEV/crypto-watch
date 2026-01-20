import { useRouter } from 'expo-router';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { memo } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { HStack, MiniAreaChart, Text, View, VStack } from '../../components/ui';
import { CryptoCoin } from '../../types/binance';

interface CryptoRowProps {
  coin: CryptoCoin;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const CryptoRow = memo(function CryptoRow({ coin }: CryptoRowProps) {
  const flashAnimation = useSharedValue(0);
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/crypto-details',
      params: { symbol: coin.symbol }
    });
  };
  const priceDirection = useSharedValue<'up' | 'down' | 'neutral'>('neutral');

  // Update animation when price direction changes
  React.useEffect(() => {
    if (coin.priceDirection !== 'neutral') {
      priceDirection.value = coin.priceDirection;
      flashAnimation.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 150 })
      );
    }
  }, [coin.priceDirection, coin.currentPrice]);

  // Animated background color for flash effect
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      flashAnimation.value,
      [0, 1],
      [
        'rgba(255, 255, 255, 0)', // transparent
        priceDirection.value === 'up' 
          ? 'rgba(16, 185, 129, 0.2)' // green flash
          : priceDirection.value === 'down' 
          ? 'rgba(239, 68, 68, 0.2)' // red flash
          : 'rgba(255, 255, 255, 0)' // transparent for neutral
      ]
    );

    return {
      backgroundColor,
    };
  });

  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return price.toFixed(2);
    }
    return price.toFixed(6);
  };

  const formatPercentage = (percent: number): string => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} color="#10B981" />;
    if (change < 0) return <TrendingDown size={16} color="#EF4444" />;
    return <Minus size={16} color="#6B7280" />;
  };

  // Generate realistic chart data based on price history simulation
  const generateChartData = () => {
    const data = [];
    const changePercent = coin.priceChangePercent;
    
    // Create normalized data points (0-100 scale)
    const baseValue = 50;
    
    // Generate 12 points simulating price movement
    for (let i = 0; i < 12; i++) {
      const progress = i / 11; // 0 to 1
      // Apply the actual price change percentage to the progression
      const trendValue = baseValue + (changePercent * progress * 0.3); // Scale down the change
      // Add some volatility
      const volatility = (Math.random() - 0.5) * 2;
      const finalValue = trendValue + volatility;
      
      data.push({
        x: i + 1,
        y: Math.max(20, Math.min(80, finalValue)) // Keep between 20-80
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const chartColor = coin.priceChange > 0 ? '#10B981' : coin.priceChange < 0 ? '#EF4444' : '#6B7280';

  return (
    <AnimatedView style={[animatedBackgroundStyle]} className="mx-3 my-2">
      <Pressable onPress={handlePress}>
        <View className={`border bg-slate-800/90 rounded-xl p-4 ${
          coin.priceChange > 0 ? 'border-green-500/30' : 
          coin.priceChange < 0 ? 'border-red-500/30' : 'border-slate-700'
        }`}>
        <HStack className="justify-between items-start mb-3">
          {/* Symbol and Info */}
          <HStack space="sm" className="items-center flex-1">
            <View className="w-8 h-8 bg-blue-500 rounded-lg items-center justify-center">
              <Text className="text-white font-bold text-xs">
                {coin.symbol.replace('USDT', '').charAt(0)}
              </Text>
            </View>
            <VStack>
              <Text className="text-white font-bold text-lg">
                {coin.symbol.replace('USDT', '')}
              </Text>
              <Text className="text-slate-400 text-xs">
                Vol: {parseFloat(coin.volume).toLocaleString(undefined, { notation: 'compact' })}
              </Text>
            </VStack>
          </HStack>

          {/* Price and Change */}
          <VStack space="xs" className="items-end">
            <Text className="text-white font-bold text-lg">
              ${formatPrice(coin.currentPrice)}
            </Text>
            <View className={`px-2 py-1 rounded-md flex-row items-center ${
              coin.priceChange > 0 ? 'bg-green-500/20' :
              coin.priceChange < 0 ? 'bg-red-500/20' : 'bg-slate-600/20'
            }`} style={{ gap: 4 }}>
              <TrendingUp 
                size={12} 
                color={
                  coin.priceChange > 0 ? '#10B981' :
                  coin.priceChange < 0 ? '#EF4444' : '#6B7280'
                } 
                className={coin.priceChange < 0 ? 'rotate-180' : ''}
              />
              <Text className={`text-xs font-medium ${
                coin.priceChange > 0 ? 'text-green-400' :
                coin.priceChange < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {coin.priceChange > 0 ? '+' : ''}{coin.priceChangePercent.toFixed(2)}%
              </Text>
            </View>
            <Text className="text-slate-400 text-xs">
              ${formatPrice(coin.openPrice)}
            </Text>
          </VStack>
        </HStack>
            
        {/* Full Width Area Chart */}
        <View className="mt-3">
          <MiniAreaChart 
            data={chartData}
            color={chartColor}
            height={45}
          />
        </View>

        {/* 24h Range */}
        <View className="mt-3">
          <HStack className="justify-between items-center mb-1">
            <Text className="text-slate-400 text-xs">24h Range</Text>
            <Text className="text-slate-400 text-xs">
              ${formatPrice(coin.lowPrice)} - ${formatPrice(coin.highPrice)}
            </Text>
          </HStack>
          <View className="h-1 bg-slate-700 rounded-full">
            <View 
              className="h-full bg-blue-400 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(0, 
                  ((coin.currentPrice - coin.lowPrice) / (coin.highPrice - coin.lowPrice)) * 100
                ))}%`
              }}
            />
          </View>
        </View>
      </View>
      </Pressable>
    </AnimatedView>
  );
});

CryptoRow.displayName = 'CryptoRow';