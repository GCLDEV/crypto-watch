import React from 'react';
import { Area, CartesianChart } from 'victory-native';
import { HStack, Text, View, VStack } from '../ui';

interface MarketTrendChartProps {
  data: Array<{ x: number; y: number; label?: string }>;
  title: string;
  color: string;
  width?: number;
  height?: number;
}

export function MarketTrendChart({ 
  data, 
  title, 
  color, 
  width = 300, 
  height = 120 
}: MarketTrendChartProps) {
  const latestValue = data[data.length - 1]?.y || 0;
  const firstValue = data[0]?.y || 0;
  const change = latestValue - firstValue;
  const changePercent = firstValue > 0 ? ((change / firstValue) * 100).toFixed(2) : '0.00';

  return (
    <View className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <VStack space="sm">
        <HStack className="justify-between items-center">
          <Text className="text-white font-bold text-lg">{title}</Text>
          <View className={`px-2 py-1 rounded ${
            change >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <Text className={`text-sm font-medium ${
              change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {change >= 0 ? '+' : ''}{changePercent}%
            </Text>
          </View>
        </HStack>
        
        <View style={{ width, height }}>
          <CartesianChart
            data={data.map(point => ({ x: point.x, y: 100 - point.y }))} // Invert Y axis
            xKey="x"
            yKeys={['y']}
            padding={0}
            domainPadding={0}
          >
            {({ points }) => (
              <Area
                points={points.y}
                y0={100} // Set baseline to top
                color={color}
                animate={{ type: 'timing', duration: 1000 }}
              />
            )}
          </CartesianChart>
        </View>
      </VStack>
    </View>
  );
}