import {
  Box,
  Button,
  Card,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { WatchlistStock } from '../types/watchlist';
import { useStockDetails } from '../hooks/useStockDetails';

interface WatchlistStockCardProps {
  stock: WatchlistStock;
  onRemove: (symbol: string) => void;
  onDetails: (symbol: string) => void;
  onReady?: (symbol: string) => void;
  isRemoving?: boolean;
}

function WatchlistStockCard({
  stock,
  onRemove,
  onDetails,
  onReady,
  isRemoving = false,
}: WatchlistStockCardProps) {
  const { data, isLoading } = useStockDetails(stock.symbol);
  const details = data?.data;

  const [imageLoaded, setImageLoaded] = useState(false);
  const hasLogo = !!details?.logo;
  const isReady = !isLoading && !!details && (imageLoaded || !hasLogo);

  useEffect(() => {
    if (isReady && onReady) {
      onReady(stock.symbol);
    }
  }, [isReady, onReady, stock.symbol]);

  const percentChange = details?.percentChange ?? 0;
  const isPositive = percentChange >= 0;

  return (
    <Card.Root
      width="100%"
      cursor="pointer"
      borderColor="gray.200"
      _hover={{ shadow: 'md', borderColor: 'blue.200' }}
      transition="all 0.15s ease, opacity 0.2s ease-in"
      onClick={() => onDetails(stock.symbol)}
      opacity={isReady ? 1 : 0}
    >
      <Card.Body p={4}>
        {!details ? (
          <VStack align="stretch" gap={3}>
            <HStack gap={3}>
              <Skeleton boxSize="40px" borderRadius="md" />
              <VStack align="start" gap={1} flex={1}>
                <Skeleton height="16px" width="60%" />
                <Skeleton height="12px" width="80%" />
              </VStack>
            </HStack>
            <VStack align="start" gap={1}>
              <Skeleton height="24px" width="50%" />
              <Skeleton height="14px" width="35%" />
            </VStack>
            <HStack gap={2} mt={1}>
              <Skeleton height="24px" flex={1} borderRadius="md" />
              <Skeleton height="24px" flex={1} borderRadius="md" />
            </HStack>
          </VStack>
        ) : (
          <VStack align="stretch" gap={3}>
            <HStack gap={3}>
              {details.logo ? (
                <Image
                  src={details.logo}
                  alt={details.companyName}
                  boxSize="40px"
                  borderRadius="md"
                  objectFit="contain"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              ) : (
                <Box
                  boxSize="40px"
                  borderRadius="md"
                  bg="gray.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="xs" fontWeight="bold" color="gray.500">
                    {stock.symbol.slice(0, 2)}
                  </Text>
                </Box>
              )}
              <VStack align="start" gap={0} flex={1} overflow="hidden">
                <Text fontWeight="bold" fontSize="md">
                  {stock.symbol}
                </Text>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  maxW="100%"
                >
                  {details.companyName}
                </Text>
              </VStack>
            </HStack>

            <VStack align="start" gap={0}>
              <Text fontSize="xl" fontWeight="bold">
                ${details.currentPrice.toFixed(2)}
              </Text>
              <HStack gap={1}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={isPositive ? 'green.500' : 'red.500'}
                >
                  {isPositive ? '+' : ''}{details.change.toFixed(2)}
                </Text>
                <Text
                  fontSize="sm"
                  color={isPositive ? 'green.500' : 'red.500'}
                >
                  ({isPositive ? '+' : ''}{percentChange.toFixed(2)}%)
                </Text>
              </HStack>
            </VStack>

            <HStack gap={2} mt={1}>
              <Button
                size="xs"
                variant="outline"
                colorPalette="blue"
                flex={1}
                onClick={(e) => {
                  e.stopPropagation();
                  onDetails(stock.symbol);
                }}
              >
                Details
              </Button>
              <Button
                size="xs"
                variant="outline"
                colorPalette="red"
                flex={1}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(stock.symbol);
                }}
                loading={isRemoving}
              >
                Remove
              </Button>
            </HStack>
          </VStack>
        )}
      </Card.Body>
    </Card.Root>
  );
}

export default WatchlistStockCard;
