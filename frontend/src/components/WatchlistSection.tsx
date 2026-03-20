import {
  Alert,
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import {
  useAddWatchlistStock,
  useRemoveWatchlistStock,
} from '../hooks/useWatchlistMutations';
import StockDetailsModal from './StockDetailsModal';
import WatchlistSearchBar from './WatchlistSearchBar';
import WatchlistStockCard from './WatchlistStockCard';

function WatchlistSection() {
  const { data, isLoading, isError, error } = useWatchlist();
  const addMutation = useAddWatchlistStock();
  const removeMutation = useRemoveWatchlistStock();
  const [removingSymbol, setRemovingSymbol] = useState<string | null>(null);
  const [detailsSymbol, setDetailsSymbol] = useState<string | null>(null);

  const stocks = data?.data ?? [];

  const [readySymbols, setReadySymbols] = useState<Set<string>>(new Set());
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const handleCardReady = useCallback((symbol: string) => {
    setReadySymbols((prev) => {
      if (prev.has(symbol)) return prev;
      const next = new Set(prev);
      next.add(symbol);
      return next;
    });
  }, []);

  const allCurrentReady = stocks.length > 0 && stocks.every((s) => readySymbols.has(s.symbol));

  if (allCurrentReady && !initialLoadDone) {
    setInitialLoadDone(true);
  }

  const showGrid = initialLoadDone || allCurrentReady;

  const handleAdd = (symbol: string) => {
    addMutation.mutate({ symbol });
  };

  const handleRemove = (symbol: string) => {
    setRemovingSymbol(symbol);

    removeMutation.mutate(symbol, {
      onSettled: () => {
        setRemovingSymbol(null);
      },
    });
  };

  return (
    <Box width="100%">
      <VStack align="stretch" gap={4}>
        <Heading size="md">My Watchlist</Heading>

        <WatchlistSearchBar
          onAdd={handleAdd}
          isAdding={addMutation.isPending}
        />

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

        {removeMutation.isError && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Failed to remove stock</Alert.Title>
              <Alert.Description>
                {removeMutation.error instanceof Error
                  ? removeMutation.error.message
                  : 'An unexpected error occurred.'}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {isLoading ? (
          <VStack py={10}>
            <Spinner size="lg" />
            <Text color="gray.500" fontSize="sm">Loading watchlist...</Text>
          </VStack>
        ) : isError ? (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Failed to load watchlist</Alert.Title>
              <Alert.Description>
                {error instanceof Error ? error.message : 'Unknown error'}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : stocks.length === 0 ? (
          <Text color="gray.500">Your watchlist is currently empty.</Text>
        ) : (
          <Box position="relative">
            {!showGrid && (
              <VStack py={10}>
                <Spinner size="lg" />
                <Text color="gray.500" fontSize="sm">Loading stock data...</Text>
              </VStack>
            )}

            <Box
              opacity={showGrid ? 1 : 0}
              transition="opacity 0.2s ease-in"
              position={showGrid ? 'relative' : 'absolute'}
              visibility={showGrid ? 'visible' : 'hidden'}
            >
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
                {stocks.map((stock) => (
                  <WatchlistStockCard
                    key={stock.id}
                    stock={stock}
                    onRemove={handleRemove}
                    onDetails={setDetailsSymbol}
                    onReady={handleCardReady}
                    isRemoving={
                      removeMutation.isPending && removingSymbol === stock.symbol
                    }
                  />
                ))}
              </SimpleGrid>
            </Box>
          </Box>
        )}
      </VStack>

      <StockDetailsModal
        symbol={detailsSymbol}
        open={detailsSymbol !== null}
        onClose={() => setDetailsSymbol(null)}
      />
    </Box>
  );
}

export default WatchlistSection;
