import { Box, Container, HStack, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import NotificationBell from './components/NotificationBell';
import TopStockTickerSection from './components/TopStockTickerSection';
import WatchlistSection from './components/WatchlistSection';
import WatchlistSummary from './components/WatchlistSummary';
import { useInitializeSession } from './hooks/useInitializeSession';

function App() {
  const { ready } = useInitializeSession();

  if (!ready) {
    return (
      <Container maxW="6xl" py={10}>
        <VStack py={20} gap={4}>
          <Spinner size="xl" />
          <Text color="gray.500">Connecting to server...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={10}>
      <VStack align="stretch" gap={8}>
        <HStack justify="space-between" align="start">
          <Box>
            <Heading mb={2}>Financial Monitoring Platform</Heading>
            <Text color="gray.600">
              Track stocks, manage your watchlist, and receive smart in-app alerts.
            </Text>
          </Box>
          <NotificationBell />
        </HStack>

        <TopStockTickerSection />
        <WatchlistSummary />
        <WatchlistSection />
      </VStack>
    </Container>
  );
}

export default App;
