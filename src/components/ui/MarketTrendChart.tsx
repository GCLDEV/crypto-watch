import React from 'react';
import { CartesianChart, Line } from 'victory-native';
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
        
        <HStack space="xs">
          {/* Y-axis labels */}
          <VStack className="justify-between py-2" style={{ height }}>
            <Text className="text-slate-400 text-xs">80</Text>
            <Text className="text-slate-400 text-xs">60</Text>
            <Text className="text-slate-400 text-xs">40</Text>
            <Text className="text-slate-400 text-xs">20</Text>
          </VStack>
          
          {/* Chart container */}
          <VStack space="xs" className="flex-1">
            {/* Chart */}
            <View style={{ width: width - 30, height }}>
              <CartesianChart
                data={data.map(point => ({ x: point.x, y: 100 - point.y }))} // Invert Y axis
                xKey="x"
                yKeys={['y']}
                padding={8}
              >
                {({ points }) => (
                  <Line
                    points={points.y}
                    color={color}
                    strokeWidth={2}
                    animate={{ type: 'timing', duration: 1000 }}
                  />
                )}
              </CartesianChart>
            </View>
            
            {/* Manual X-axis labels */}
            <HStack className="justify-between px-2">
              <Text className="text-slate-400 text-xs">0h</Text>
              <Text className="text-slate-400 text-xs">6h</Text>
              <Text className="text-slate-400 text-xs">12h</Text>
              <Text className="text-slate-400 text-xs">18h</Text>
              <Text className="text-slate-400 text-xs">24h</Text>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </View>
  );
}