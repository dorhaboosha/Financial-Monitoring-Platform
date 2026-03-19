import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import type { TickerStockItem as TickerStockItemType } from '../types/market';

interface TickerStockItemProps {
  stock: TickerStockItemType;
  onAdd: (symbol: string) => void;
  isAdding?: boolean;
}

function TickerStockItem({
  stock,
  onAdd,
  isAdding = false,
}: TickerStockItemProps) {
  const currentPrice =
    typeof stock.currentPrice === 'number' ? stock.currentPrice : 0;

  const percentChange =
    typeof stock.percentChange === 'number' ? stock.percentChange : 0;

  const isPositive = percentChange >= 0;
  const changeText = `${isPositive ? '+' : ''}${percentChange.toFixed(2)}%`;

  return (
    <Box
      minW="260px"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      bg="white"
      boxShadow="sm"
    >
      <VStack align="stretch" gap={3}>
        <VStack align="start" gap={0}>
          <Text fontWeight="bold" fontSize="lg">
            {stock.symbol}
          </Text>
          <Text
            fontSize="sm"
            color="gray.500"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {stock.companyName}
          </Text>
        </VStack>

        <HStack justify="space-between">
          <Text fontWeight="semibold">${currentPrice.toFixed(2)}</Text>
          <Text color={isPositive ? 'green.500' : 'red.500'} fontWeight="medium">
            {changeText}
          </Text>
        </HStack>

        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => onAdd(stock.symbol)}
          loading={isAdding}
        >
          Add to Watchlist
        </Button>
      </VStack>
    </Box>
  );
}

export default TickerStockItem;