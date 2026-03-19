import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import TopStockTickerSection from './components/TopStockTickerSection';
import WatchlistSection from './components/WatchlistSection';
import { useInitializeSession } from './hooks/useInitializeSession';

function App() {
  useInitializeSession();

  return (
    <Container maxW="6xl" py={10}>
      <VStack align="stretch" gap={8}>
        <Box>
          <Heading mb={2}>Financial Monitoring Platform</Heading>
          <Text color="gray.600">
            Track stocks, manage your watchlist, and receive smart in-app alerts.
          </Text>
        </Box>

        <TopStockTickerSection />
        <WatchlistSection />
      </VStack>
    </Container>
  );
}

export default App;