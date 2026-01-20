import React from 'react';
import { CartesianChart, Line } from 'victory-native';
import { HStack, Text, View, VStack } from '../ui';

interface MiniLineChartProps {
  data: Array<{ x: number; y: number }>;
  color: string;
  width?: number | undefined;
  height?: number;
}

export function MiniAreaChart({ data, color, width, height = 40 }: MiniLineChartProps) {
  // Invert Y values to fix upside-down chart
  const invertedData = data.map(point => ({
    x: point.x,
    y: 100 - point.y // Invert the Y axis
  }));

  return (
    <View style={{ width: width || '100%', height: height + 15, overflow: 'visible' }}>
      <HStack space="xs">
        {/* Y-axis labels */}
        <VStack className="justify-between py-1" style={{ height }}>
          <Text className="text-slate-400" style={{ fontSize: 8 }}>80</Text>
          <Text className="text-slate-400" style={{ fontSize: 8 }}>40</Text>
          <Text className="text-slate-400" style={{ fontSize: 8 }}>20</Text>
        </VStack>
        
        {/* Chart container */}
        <VStack space="xs" className="flex-1">
          {/* Chart */}
          <View style={{ height }}>
            <CartesianChart
              data={invertedData}
              xKey="x"
              yKeys={['y']}
              padding={4}
            >
              {({ points }) => (
                <Line
                  points={points.y}
                  color={color}
                  strokeWidth={1.5}
                  animate={{ type: 'timing', duration: 500 }}
                />
              )}
            </CartesianChart>
          </View>
          
          {/* X-axis labels */}
          <HStack className="justify-between px-1">
            <Text className="text-slate-400" style={{ fontSize: 8 }}>0h</Text>
            <Text className="text-slate-400" style={{ fontSize: 8 }}>6h</Text>
            <Text className="text-slate-400" style={{ fontSize: 8 }}>12h</Text>
          </HStack>
        </VStack>
      </HStack>
    </View>
  );
}