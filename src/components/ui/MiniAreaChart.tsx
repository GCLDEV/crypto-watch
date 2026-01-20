import React from 'react';
import { Area, CartesianChart } from 'victory-native';
import { View } from '../ui';

interface MiniAreaChartProps {
  data: Array<{ x: number; y: number }>;
  color: string;
  width?: number | undefined;
  height?: number;
}

export function MiniAreaChart({ data, color, width, height = 40 }: MiniAreaChartProps) {
  // Invert Y values to fix upside-down chart
  const invertedData = data.map(point => ({
    x: point.x,
    y: 100 - point.y // Invert the Y axis
  }));

  return (
    <View style={{ width: width || '100%', height, overflow: 'visible' }}>
      <CartesianChart
        data={invertedData}
        xKey="x"
        yKeys={['y']}
        padding={{ left: 0, right: 0, top: 2, bottom: 2 }}
        domainPadding={{ x: 0, y: 4 }}
      >
        {({ points }) => (
          <Area
            points={points.y}
            y0={100} // Set baseline to top instead of bottom
            color={color}
            animate={{ type: 'timing', duration: 500 }}
          />
        )}
      </CartesianChart>
    </View>
  );
}