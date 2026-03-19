import {
  Alert,
  Box,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTickerStocks } from '../hooks/useTickerStocks';
import { useAddWatchlistStock } from '../hooks/useWatchlistMutations';
import TickerStockItem from './TickerStockItem';

function TopStockTickerSection() {
  const { data, isLoading, isError, error } = useTickerStocks();
  const addMutation = useAddWatchlistStock();

  const handleAdd = (symbol: string) => {
    addMutation.mutate({ symbol });
  };

  return (
    <Box width="100%">
      <VStack align="stretch" gap={4}>
        <Heading size="md">Top Stock Ticker / Slider</Heading>

        {addMutation.isError && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Failed to add stock</Alert.Title>
              <Alert.Description>
                {addMutation.error instanceof Error
                  ? addMutation.error.message
                  : 'An unexpected error occurred.'}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Failed to load ticker stocks</Alert.Title>
              <Alert.Description>
                {error instanceof Error ? error.message : 'Unknown error'}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : !data?.data.length ? (
          <Text color="gray.500">No ticker stocks available.</Text>
        ) : (
          <Box overflowX="auto" pb={2}>
            <HStack gap={4} align="stretch" minW="max-content">
              {data.data.map((stock) => (
                <TickerStockItem
                  key={stock.symbol}
                  stock={stock}
                  onAdd={handleAdd}
                  isAdding={addMutation.isPending}
                />
              ))}
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default TopStockTickerSection;