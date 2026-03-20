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
  Skeleton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useStockDetails } from '../hooks/useStockDetails';
import { useStockInsights } from '../hooks/useStockInsights';
import type { StockDetails, StockInsights } from '../types/market';
import CreateAlertForm from './CreateAlertForm';
import StockAlertsList from './StockAlertsList';

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

function formatMarketCap(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}T`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}B`;
  return `$${value.toFixed(2)}M`;
}

function KeyMetricsSection({ insights }: { insights: StockInsights }) {
  const { metrics } = insights;
  const hasAny =
    metrics.peRatio != null ||
    metrics.weekHigh52 != null ||
    metrics.weekLow52 != null ||
    metrics.beta != null ||
    metrics.dividendYield != null;

  if (!hasAny) return null;

  return (
    <>
      <Separator />
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          Key Metrics
        </Text>
        <SimpleGrid columns={2} gap={2}>
          <Box>
            {metrics.peRatio != null && (
              <StockDetailRow label="P/E Ratio" value={metrics.peRatio.toFixed(2)} />
            )}
            {metrics.weekHigh52 != null && (
              <StockDetailRow label="52W High" value={`$${metrics.weekHigh52.toFixed(2)}`} />
            )}
            {metrics.beta != null && (
              <StockDetailRow label="Beta" value={metrics.beta.toFixed(2)} />
            )}
          </Box>
          <Box>
            {metrics.dividendYield != null && (
              <StockDetailRow label="Dividend Yield" value={`${metrics.dividendYield.toFixed(2)}%`} />
            )}
            {metrics.weekLow52 != null && (
              <StockDetailRow label="52W Low" value={`$${metrics.weekLow52.toFixed(2)}`} />
            )}
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
}

function RecommendationSection({ insights }: { insights: StockInsights }) {
  const { recommendation, priceTarget } = insights;
  if (!recommendation && !priceTarget) return null;

  const total = recommendation
    ? recommendation.strongBuy + recommendation.buy + recommendation.hold + recommendation.sell + recommendation.strongSell
    : 0;

  return (
    <>
      <Separator />
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          Analyst Outlook
        </Text>

        {recommendation && total > 0 && (
          <Box mb={3}>
            <HStack gap={1} mb={1.5} flexWrap="wrap">
              {recommendation.strongBuy > 0 && (
                <Badge colorPalette="green" size="sm">
                  Strong Buy {recommendation.strongBuy}
                </Badge>
              )}
              {recommendation.buy > 0 && (
                <Badge colorPalette="green" variant="outline" size="sm">
                  Buy {recommendation.buy}
                </Badge>
              )}
              {recommendation.hold > 0 && (
                <Badge colorPalette="yellow" size="sm">
                  Hold {recommendation.hold}
                </Badge>
              )}
              {recommendation.sell > 0 && (
                <Badge colorPalette="red" variant="outline" size="sm">
                  Sell {recommendation.sell}
                </Badge>
              )}
              {recommendation.strongSell > 0 && (
                <Badge colorPalette="red" size="sm">
                  Strong Sell {recommendation.strongSell}
                </Badge>
              )}
            </HStack>
            <Box h="6px" borderRadius="full" overflow="hidden" display="flex" bg="gray.100">
              {recommendation.strongBuy > 0 && (
                <Box bg="green.600" flex={recommendation.strongBuy / total} />
              )}
              {recommendation.buy > 0 && (
                <Box bg="green.400" flex={recommendation.buy / total} />
              )}
              {recommendation.hold > 0 && (
                <Box bg="yellow.400" flex={recommendation.hold / total} />
              )}
              {recommendation.sell > 0 && (
                <Box bg="red.400" flex={recommendation.sell / total} />
              )}
              {recommendation.strongSell > 0 && (
                <Box bg="red.600" flex={recommendation.strongSell / total} />
              )}
            </Box>
            <Text fontSize="xs" color="gray.400" mt={1}>
              {total} analysts &middot; {recommendation.period}
            </Text>
          </Box>
        )}

        {priceTarget && (
          <SimpleGrid columns={3} gap={2} textAlign="center">
            <Box p={2} bg="red.50" borderRadius="md">
              <Text fontSize="xs" color="gray.500">Low</Text>
              <Text fontWeight="bold" fontSize="sm">${priceTarget.targetLow.toFixed(2)}</Text>
            </Box>
            <Box p={2} bg="blue.50" borderRadius="md">
              <Text fontSize="xs" color="gray.500">Median</Text>
              <Text fontWeight="bold" fontSize="sm">${priceTarget.targetMedian.toFixed(2)}</Text>
            </Box>
            <Box p={2} bg="green.50" borderRadius="md">
              <Text fontSize="xs" color="gray.500">High</Text>
              <Text fontWeight="bold" fontSize="sm">${priceTarget.targetHigh.toFixed(2)}</Text>
            </Box>
          </SimpleGrid>
        )}
      </Box>
    </>
  );
}

function CompanyNewsSection({ insights }: { insights: StockInsights }) {
  const { news } = insights;
  if (news.length === 0) return null;

  return (
    <>
      <Separator />
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          Recent News
        </Text>
        <VStack align="stretch" gap={2}>
          {news.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ textDecoration: 'none' }}
            >
              <Box
                p={2.5}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ bg: 'gray.50' }}
                transition="background 0.1s ease"
              >
                <Text fontSize="sm" fontWeight="medium" lineClamp={2}>
                  {item.headline}
                </Text>
                <HStack mt={1} gap={2}>
                  <Text fontSize="xs" color="gray.400">
                    {item.source}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {new Date(item.datetime * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </HStack>
              </Box>
            </Link>
          ))}
        </VStack>
      </Box>
    </>
  );
}

function InsightsLoadingSkeleton() {
  return (
    <>
      <Separator />
      <VStack align="stretch" gap={3}>
        <Skeleton height="14px" width="30%" />
        <SimpleGrid columns={2} gap={2}>
          <VStack gap={1}>
            <Skeleton height="12px" width="100%" />
            <Skeleton height="12px" width="100%" />
          </VStack>
          <VStack gap={1}>
            <Skeleton height="12px" width="100%" />
            <Skeleton height="12px" width="100%" />
          </VStack>
        </SimpleGrid>
      </VStack>
      <Separator />
      <VStack align="stretch" gap={3}>
        <Skeleton height="14px" width="25%" />
        <Skeleton height="6px" width="100%" borderRadius="full" />
        <SimpleGrid columns={3} gap={2}>
          <Skeleton height="48px" borderRadius="md" />
          <Skeleton height="48px" borderRadius="md" />
          <Skeleton height="48px" borderRadius="md" />
        </SimpleGrid>
      </VStack>
      <Separator />
      <VStack align="stretch" gap={2}>
        <Skeleton height="14px" width="25%" />
        <Skeleton height="56px" borderRadius="md" />
        <Skeleton height="56px" borderRadius="md" />
      </VStack>
    </>
  );
}

function StockDetailsModal({ symbol, open, onClose }: StockDetailsModalProps) {
  const { data, isLoading, isError } = useStockDetails(open ? symbol : null);
  const { data: insightsData, isLoading: insightsLoading } = useStockInsights(open ? symbol : null);
  const stock = data?.data;
  const insights = insightsData?.data;

  const lastStockRef = useRef<StockDetails | null>(null);
  const lastInsightsRef = useRef<StockInsights | null>(null);
  if (stock) lastStockRef.current = stock;
  if (insights) lastInsightsRef.current = insights;
  const displayStock = stock ?? lastStockRef.current;
  const displayInsights = insights ?? lastInsightsRef.current;

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
      size="lg"
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxH="85vh" overflow="auto">
            <Dialog.Header>
              <Dialog.Title>Stock Details</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body pb={6}>
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
                          <VStack align="start" gap={0} flex={1}>
                            <Text fontWeight="bold" fontSize="xl">
                              {displayStock.symbol}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {displayStock.companyName}
                            </Text>
                            {(displayStock.exchange || displayStock.industry) && (
                              <HStack gap={2} mt={1} flexWrap="wrap">
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
                            {displayStock.marketCap != null && displayStock.marketCap > 0 && (
                              <StockDetailRow
                                label="Market Cap"
                                value={formatMarketCap(displayStock.marketCap)}
                              />
                            )}
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

                        {insightsLoading && !displayInsights ? (
                          <InsightsLoadingSkeleton />
                        ) : displayInsights ? (
                          <>
                            <KeyMetricsSection insights={displayInsights} />
                            <RecommendationSection insights={displayInsights} />
                            <CompanyNewsSection insights={displayInsights} />
                          </>
                        ) : null}

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

                        <CreateAlertForm symbol={displayStock.symbol} />
                        <StockAlertsList symbol={displayStock.symbol} />
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
