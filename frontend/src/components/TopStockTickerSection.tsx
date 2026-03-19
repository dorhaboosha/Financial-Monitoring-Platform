import {
  Alert,
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTickerStocks } from '../hooks/useTickerStocks';
import { useAddWatchlistStock } from '../hooks/useWatchlistMutations';
import TickerStockItem from './TickerStockItem';
import "./TopStockTicker.css";

function TopStockTickerSection() {
  const { data, isLoading, isError, error } = useTickerStocks();
  const addMutation = useAddWatchlistStock();

  const handleAdd = (symbol: string) => {
    addMutation.mutate({ symbol });
  };

  const tickerStocks = data?.data ?? [];
  const duplicatedStocks = [...tickerStocks, ...tickerStocks];

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
        ) : !tickerStocks.length ? (
          <Text color="gray.500">No ticker stocks available.</Text>
        ) : (
          <Box className="ticker-wrapper" pb={2}>
            <Box className="ticker-track">
              {duplicatedStocks.map((stock, index) => (
                <TickerStockItem
                  key={`${stock.symbol}-${index}`}
                  stock={stock}
                  onAdd={handleAdd}
                  isAdding={addMutation.isPending}
                />
              ))}
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default TopStockTickerSection;