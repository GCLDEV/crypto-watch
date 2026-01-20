import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BiometricGuard } from '../components/BiometricGuard/BiometricGuard';
import { HomeScreen } from './HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <BiometricGuard
        onAuthenticationSuccess={() => console.log('✅ Autenticação bem-sucedida')}
        onAuthenticationError={(error) => console.log('❌ Erro na autenticação:', error)}
      >
        <HomeScreen />
      </BiometricGuard>
    </SafeAreaProvider>
  );
}
