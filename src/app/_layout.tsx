import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../../global.css';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="dark">
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: '#0F172A',
              },
            }}
          />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}