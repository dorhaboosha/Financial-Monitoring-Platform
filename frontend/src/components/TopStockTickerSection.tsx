import {
  Alert,
  Box,
  Heading,
  Marquee,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTickerStocks } from '../hooks/useTickerStocks';
import { useAddWatchlistStock } from '../hooks/useWatchlistMutations';
import TickerStockItem from './TickerStockItem';

function TopStockTickerSection() {
  const { data, isLoading, isError, error } = useTickerStocks();
  const addMutation = useAddWatchlistStock();
  const [addingSymbol, setAddingSymbol] = useState<string | null>(null);

  const handleAdd = (symbol: string) => {
    setAddingSymbol(symbol);

    addMutation.mutate(
      { symbol },
      {
        onSettled: () => {
          setAddingSymbol(null);
        },
      }
    );
  };

  const tickerStocks = data?.data ?? [];

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
          <Marquee.Root speed={45} pauseOnInteraction>
            <Marquee.Viewport py={2}>
              <Marquee.Content gap="4">
                {tickerStocks.map((stock) => (
                  <Marquee.Item key={stock.symbol}>
                    <TickerStockItem
                      stock={stock}
                      onAdd={handleAdd}
                      isAdding={
                        addMutation.isPending && addingSymbol === stock.symbol
                      }
                    />
                  </Marquee.Item>
                ))}
              </Marquee.Content>
            </Marquee.Viewport>
          </Marquee.Root>
        )}
      </VStack>
    </Box>
  );
}

export default TopStockTickerSection;