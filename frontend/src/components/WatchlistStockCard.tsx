import { Button, Card, HStack, Text, VStack } from '@chakra-ui/react';
import type { WatchlistStock } from '../types/watchlist';

interface WatchlistStockCardProps {
  stock: WatchlistStock;
  onRemove: (symbol: string) => void;
  onDetails: (symbol: string) => void;
  isRemoving?: boolean;
}

function WatchlistStockCard({
  stock,
  onRemove,
  onDetails,
  isRemoving = false,
}: WatchlistStockCardProps) {
  return (
    <Card.Root width="100%">
      <Card.Body>
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Text fontSize="lg" fontWeight="bold">
              {stock.symbol}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Added at: {new Date(stock.createdAt).toLocaleString()}
            </Text>
          </VStack>

          <HStack gap={2}>
            <Button
              size="sm"
              variant="outline"
              colorPalette="blue"
              onClick={() => onDetails(stock.symbol)}
            >
              Details
            </Button>
            <Button
              size="sm"
              colorPalette="red"
              variant="outline"
              onClick={() => onRemove(stock.symbol)}
              loading={isRemoving}
            >
              Remove
            </Button>
          </HStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}

export default WatchlistStockCard;