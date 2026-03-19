import {
  Badge,
  Box,
  CloseButton,
  Dialog,
  HStack,
  Image,
  Link,
  Portal,
  Separator,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useStockDetails } from '../hooks/useStockDetails';
import type { StockDetails } from '../types/market';

interface StockDetailsModalProps {
  symbol: string | null;
  open: boolean;
  onClose: () => void;
}

function StockDetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <HStack justify="space-between" py={1}>
      <Text color="gray.500" fontSize="sm">
        {label}
      </Text>
      <Text fontWeight="medium" fontSize="sm">
        {value}
      </Text>
    </HStack>
  );
}

function StockDetailsModal({ symbol, open, onClose }: StockDetailsModalProps) {
  const { data, isLoading, isError } = useStockDetails(open ? symbol : null);
  const stock = data?.data;

  const lastStockRef = useRef<StockDetails | null>(null);
  if (stock) {
    lastStockRef.current = stock;
  }
  const displayStock = stock ?? lastStockRef.current;

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [symbol]);

  const hasLogo = !!displayStock?.logo;
  const isReady = !isLoading && !!displayStock && (imageLoaded || !hasLogo);

  const percentChange = displayStock?.percentChange ?? 0;
  const isPositive = percentChange >= 0;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      size="md"
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Stock Details</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body>
              {isError ? (
                <VStack py={10}>
                  <Text color="red.500">
                    Failed to load details for {symbol}.
                  </Text>
                </VStack>
              ) : (
                <Box position="relative">
                  {!isReady && (
                    <VStack
                      py={10}
                      position="absolute"
                      inset={0}
                      zIndex={1}
                      bg="white"
                      justify="center"
                    >
                      <Spinner size="lg" />
                      <Text color="gray.500">Loading stock details...</Text>
                    </VStack>
                  )}

                  <Box
                    opacity={isReady ? 1 : 0}
                    transition="opacity 0.15s ease-in"
                  >
                    {displayStock && (
                      <VStack align="stretch" gap={4}>
                        <HStack gap={4}>
                          {displayStock.logo && (
                            <Image
                              src={displayStock.logo}
                              alt={displayStock.companyName}
                              boxSize="48px"
                              borderRadius="md"
                              objectFit="contain"
                              onLoad={() => setImageLoaded(true)}
                              onError={() => setImageLoaded(true)}
                            />
                          )}
                          <VStack align="start" gap={0}>
                            <Text fontWeight="bold" fontSize="xl">
                              {displayStock.symbol}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {displayStock.companyName}
                            </Text>
                            {(displayStock.exchange || displayStock.industry) && (
                              <HStack gap={2} mt={1}>
                                {displayStock.exchange && (
                                  <Badge size="sm" variant="subtle">
                                    {displayStock.exchange}
                                  </Badge>
                                )}
                                {displayStock.industry && (
                                  <Badge size="sm" variant="outline">
                                    {displayStock.industry}
                                  </Badge>
                                )}
                              </HStack>
                            )}
                          </VStack>
                        </HStack>

                        <Box
                          bg={isPositive ? 'green.50' : 'red.50'}
                          borderRadius="md"
                          p={3}
                        >
                          <HStack justify="space-between">
                            <Text fontSize="2xl" fontWeight="bold">
                              ${displayStock.currentPrice.toFixed(2)}
                            </Text>
                            <VStack align="end" gap={0}>
                              <Text
                                color={isPositive ? 'green.600' : 'red.600'}
                                fontWeight="semibold"
                              >
                                {isPositive ? '+' : ''}
                                {displayStock.change.toFixed(2)}
                              </Text>
                              <Text
                                color={isPositive ? 'green.600' : 'red.600'}
                                fontSize="sm"
                              >
                                ({isPositive ? '+' : ''}
                                {percentChange.toFixed(2)}%)
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>

                        <Separator />

                        <SimpleGrid columns={2} gap={2}>
                          <Box>
                            <StockDetailRow
                              label="Open"
                              value={`$${displayStock.open.toFixed(2)}`}
                            />
                            <StockDetailRow
                              label="High"
                              value={`$${displayStock.high.toFixed(2)}`}
                            />
                          </Box>
                          <Box>
                            <StockDetailRow
                              label="Low"
                              value={`$${displayStock.low.toFixed(2)}`}
                            />
                            <StockDetailRow
                              label="Prev Close"
                              value={`$${displayStock.previousClose.toFixed(2)}`}
                            />
                          </Box>
                        </SimpleGrid>

                        {displayStock.website && (
                          <>
                            <Separator />
                            <Link
                              href={displayStock.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              colorPalette="blue"
                              fontSize="sm"
                            >
                              Visit company website
                            </Link>
                          </>
                        )}

                        <Separator />

                        <Box
                          borderWidth="1px"
                          borderStyle="dashed"
                          borderRadius="md"
                          p={4}
                          textAlign="center"
                        >
                          <Text color="gray.400" fontSize="sm">
                            Alert creation will be available here.
                          </Text>
                        </Box>
                      </VStack>
                    )}
                  </Box>
                </Box>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default StockDetailsModal;
