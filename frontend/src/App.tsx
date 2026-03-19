import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useInitializeSession } from './hooks/useInitializeSession';
import WatchlistSection from './components/WatchlistSection';

function App() {
  useInitializeSession();

  return (
    <Container maxW="4xl" py={10}>
      <VStack align="stretch" gap={8}>
        <Box>
          <Heading mb={2}>Financial Monitoring Platform</Heading>
          <Text color="gray.600">
            Track stocks, manage your watchlist, and receive smart in-app alerts.
          </Text>
        </Box>
        <WatchlistSection />
      </VStack>
    </Container>
  );
}

export default App;