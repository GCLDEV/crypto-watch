import * as LocalAuthentication from 'expo-local-authentication';
import { Fingerprint, ShieldCheck, ShieldX } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Button, Center, Spinner, Text, View, VStack } from '../../components/ui';

interface BiometricGuardProps {
  children: React.ReactNode;
  onAuthenticationSuccess?: () => void;
  onAuthenticationError?: (error: string) => void;
}

export function BiometricGuard({ 
  children, 
  onAuthenticationSuccess, 
  onAuthenticationError 
}: BiometricGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

      setIsSupported(compatible && enrolled);
      setBiometricType(types);

      if (compatible && enrolled) {
        authenticateUser();
      } else {
        setError('Biometria não disponível ou não configurada');
        onAuthenticationError?.('Biometria não disponível');
      }
    } catch (err) {
      setError('Erro ao verificar suporte biométrico');
      onAuthenticationError?.('Erro ao verificar biometria');
    }
  };

  const authenticateUser = async () => {
    try {
      setIsAuthenticating(true);
      setError('');

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para acessar o CryptoWatch',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar senha do dispositivo',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsAuthenticated(true);
        onAuthenticationSuccess?.();
      } else {
        // Handle authentication failure
        let errorMessage = 'Falha na autenticação biométrica';
        
        if (result.error) {
          const errorString = String(result.error);
          if (errorString.includes('UserCancel') || errorString.includes('cancel')) {
            errorMessage = 'Autenticação cancelada pelo usuário';
          } else if (errorString.includes('UserFallback') || errorString.includes('fallback')) {
            errorMessage = 'Fallback para senha não implementado';
          }
        }
        
        setError(errorMessage);
        onAuthenticationError?.(String(result.error) || 'Falha na autenticação');
      }
    } catch (err) {
      setError('Erro durante a autenticação');
      onAuthenticationError?.('Erro durante autenticação');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getBiometricIcon = () => {
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return <ShieldCheck size={64} color="#10B981" />;
    }
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return <Fingerprint size={64} color="#3B82F6" />;
    }
    return <ShieldX size={64} color="#EF4444" />;
  };

  const getBiometricTitle = () => {
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Touch ID';
    }
    return 'Biometria';
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Center className="flex-1 px-6">
        <VStack space="lg" className="items-center">
          {/* Icon */}
          <View className="items-center justify-center w-32 h-32 bg-white dark:bg-gray-800 rounded-full shadow-lg">
            {isAuthenticating ? (
              <Spinner size="large" color="#3B82F6" />
            ) : (
              getBiometricIcon()
            )}
          </View>

          {/* Title */}
          <VStack space="sm" className="items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              CryptoWatch
            </Text>
            <Text className="text-lg text-gray-600 dark:text-gray-300 text-center">
              {isAuthenticating ? 'Autenticando...' : `Autentique-se com ${getBiometricTitle()}`}
            </Text>
          </VStack>

          {/* Error Message */}
          {error && !isAuthenticating && (
            <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
              <Text className="text-red-600 dark:text-red-400 text-center">
                {error}
              </Text>
            </View>
          )}

          {/* Status */}
          {!isSupported && !isAuthenticating && (
            <View className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <Text className="text-yellow-600 dark:text-yellow-400 text-center">
                Configure a biometria nas configurações do seu dispositivo
              </Text>
            </View>
          )}

          {/* Retry Button */}
          {!isAuthenticating && error && (
            <Button
              onPress={authenticateUser}
              className="bg-blue-600 px-8 py-3 rounded-lg shadow-md"
            >
              <Text className="text-white font-semibold">
                Tentar Novamente
              </Text>
            </Button>
          )}

          {/* Info */}
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
            Para sua segurança, você precisa se autenticar antes de acessar os dados financeiros
          </Text>
        </VStack>
      </Center>
    </View>
  );
}