import {
  Alert,
  Box,
  Heading,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
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
          <Spinner />
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
        ) : data?.data.length === 0 ? (
          <Text color="gray.500">Your watchlist is currently empty.</Text>
        ) : (
          <Stack gap={3}>
            {data?.data.map((stock) => (
              <WatchlistStockCard
                key={stock.id}
                stock={stock}
                onRemove={handleRemove}
                onDetails={setDetailsSymbol}
                isRemoving={
                  removeMutation.isPending && removingSymbol === stock.symbol
                }
              />
            ))}
          </Stack>
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