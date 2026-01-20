import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Box, Button, Heading, HStack, SafeAreaView, ScrollView, Text, VStack } from '../components/ui';

interface HomeScreenProps {}

export default function HomeScreen({}: HomeScreenProps) {
  const handleButtonPress = () => {
    console.log('Button pressed');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Box style={styles.content}>
            <VStack space="md" style={styles.mainStack}>
              <Box>
                <Heading size="xl">
                  Crypto Watch
                </Heading>
                <Text size="sm">
                  Welcome to your crypto tracking app
                </Text>
              </Box>

              <VStack space="md" style={styles.actionsSection}>
                <Text size="md" bold>
                  Quick Actions
                </Text>
                
                <HStack space="md">
                  <Button
                    style={styles.button}
                    variant="solid"
                    onPress={handleButtonPress}
                  >
                    <Text>View Portfolio</Text>
                  </Button>
                  
                  <Button
                    style={styles.button}
                    variant="outline"
                    onPress={handleButtonPress}
                  >
                    <Text>Add Crypto</Text>
                  </Button>
                </HStack>
              </VStack>

              <Box style={styles.overviewCard}>
                <VStack space="sm">
                  <Text size="md" bold>
                    Market Overview
                  </Text>
                  <Text size="sm">
                    Stay updated with the latest crypto market trends
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  mainStack: {
    flex: 1,
  },
  actionsSection: {
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
  overviewCard: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});