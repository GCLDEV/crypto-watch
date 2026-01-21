/**
 * Environment variables configuration
 * Safely access environment variables with fallback values
 * Following Expo's official documentation: https://docs.expo.dev/guides/environment-variables/
 */
export const ENV = {
  // Binance WebSocket Configuration
  BINANCE_WS_URL: 
    process.env.EXPO_PUBLIC_BINANCE_WS_URL || '',
    
  RECONNECT_INTERVAL: parseInt(
    process.env.EXPO_PUBLIC_RECONNECT_INTERVAL || 
    '5000'
  ),
  
  MAX_RECONNECT_ATTEMPTS: parseInt(
    process.env.EXPO_PUBLIC_MAX_RECONNECT_ATTEMPTS || 
    '5'
  ),

  // App Configuration
  APP_NAME: 
    process.env.EXPO_PUBLIC_APP_NAME || '',
    
  API_TIMEOUT: parseInt(
    process.env.EXPO_PUBLIC_API_TIMEOUT || 
    '10000'
  ),

  // Development/Debug flags
  DEBUG_MODE: 
    process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
    
  ENABLE_LOGS: 
    process.env.EXPO_PUBLIC_ENABLE_LOGS !== 'false',

  // API Keys (quando necessário)
  API_KEY: 
    process.env.EXPO_PUBLIC_API_KEY || 
    '',
    
  SECRET_KEY: 
    process.env.EXPO_PUBLIC_SECRET_KEY || 
    '',
} as const;

/**
 * Validates that all required environment variables are set
 */
export function validateEnvironment() {
  const requiredVars = {
    BINANCE_WS_URL: ENV.BINANCE_WS_URL,
    APP_NAME: ENV.APP_NAME,
  };

  const missingVars: string[] = [];

  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('🔧 Make sure to:');
    console.error('1. Copy .env.example to .env');
    console.error('2. Configure all required variables in .env');
    console.error('3. Restart the Expo development server');
    
    if (ENV.DEBUG_MODE) {
      console.error('📝 Check .env file and expo configuration');
    }
    
    // Em ambiente de desenvolvimento, podemos lançar erro
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  return missingVars.length === 0;
}

/**
 * Development helper to log current environment configuration
 */
export function logEnvironmentConfig() {
  if (!ENV.DEBUG_MODE) return;

  console.log('🔧 Environment Configuration:');
  console.log({
    BINANCE_WS_URL: ENV.BINANCE_WS_URL,
    RECONNECT_INTERVAL: ENV.RECONNECT_INTERVAL,
    MAX_RECONNECT_ATTEMPTS: ENV.MAX_RECONNECT_ATTEMPTS,
    APP_NAME: ENV.APP_NAME,
    API_TIMEOUT: ENV.API_TIMEOUT,
    DEBUG_MODE: ENV.DEBUG_MODE,
    ENABLE_LOGS: ENV.ENABLE_LOGS,
    // Nunca logar chaves de API em produção
    API_KEY: ENV.API_KEY ? '***' : 'Not set',
    SECRET_KEY: ENV.SECRET_KEY ? '***' : 'Not set',
  });
}