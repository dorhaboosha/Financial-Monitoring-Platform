import { Box, Button, HStack, Heading, Skeleton, Stat, Text, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useSummary } from '../hooks/useSummary';
import { SUMMARY_QUERY_KEY } from '../hooks/useSummary';

function StatCard({
  label,
  value,
  valueColor,
  isLoading,
}: {
  label: string;
  value: string;
  valueColor?: string;
  isLoading: boolean;
}) {
  return (
    <Box
      flex={1}
      minW="120px"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      _dark={{ bg: 'gray.800' }}
    >
      <Stat.Root>
        <Stat.Label fontSize="xs" color="gray.500" mb={1}>
          {label}
        </Stat.Label>
        {isLoading ? (
          <Skeleton height="28px" width="80%" mt={1} />
        ) : (
          <Stat.ValueText fontSize="lg" fontWeight="bold" color={valueColor}>
            {value}
          </Stat.ValueText>
        )}
      </Stat.Root>
    </Box>
  );
}

function WatchlistSummary() {
  const { data, isLoading, isFetching } = useSummary();
  const queryClient = useQueryClient();

  const summary = data?.data;

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
  };

  const formatChange = (val: number | null | undefined) => {
    if (val == null) return '—';
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}%`;
  };

  const formatGainer = () => {
    if (!summary?.biggestGainer) return '—';
    const g = summary.biggestGainer;
    const sign = g.changePercent >= 0 ? '+' : '';
    return `${g.symbol} (${sign}${g.changePercent.toFixed(2)}%)`;
  };

  const formatLoser = () => {
    if (!summary?.biggestLoser) return '—';
    const l = summary.biggestLoser;
    const sign = l.changePercent >= 0 ? '+' : '';
    return `${l.symbol} (${sign}${l.changePercent.toFixed(2)}%)`;
  };

  const avgChange = summary?.averageDailyChange ?? null;
  const gainerChange = summary?.biggestGainer?.changePercent ?? null;
  const loserChange = summary?.biggestLoser?.changePercent ?? null;

  if (!isLoading && summary?.totalStocks === 0) return null;

  return (
    <Box width="100%">
      <HStack justify="space-between" align="center" mb={3}>
        <Heading size="sm" color="gray.600">
          Watchlist Summary
        </Heading>
        <Button
          size="xs"
          variant="ghost"
          onClick={handleRefresh}
          loading={isFetching}
          loadingText="Refreshing..."
        >
          Refresh
        </Button>
      </HStack>

      <HStack gap={3} flexWrap="wrap">
        <StatCard
          label="Total Stocks"
          value={isLoading ? '' : String(summary?.totalStocks ?? 0)}
          isLoading={isLoading}
        />
        <StatCard
          label="Biggest Gainer"
          value={formatGainer()}
          valueColor={
            gainerChange != null && gainerChange >= 0 ? 'green.500' : 'red.500'
          }
          isLoading={isLoading}
        />
        <StatCard
          label="Biggest Loser"
          value={formatLoser()}
          valueColor={
            loserChange != null && loserChange >= 0 ? 'green.500' : 'red.500'
          }
          isLoading={isLoading}
        />
        <StatCard
          label="Avg Daily Change"
          value={formatChange(avgChange)}
          valueColor={
            avgChange != null && avgChange >= 0 ? 'green.500' : 'red.500'
          }
          isLoading={isLoading}
        />
      </HStack>

      {!isLoading && isFetching && (
        <Text fontSize="xs" color="gray.400" mt={2}>
          Updating...
        </Text>
      )}
    </Box>
  );
}

export default WatchlistSummary;
