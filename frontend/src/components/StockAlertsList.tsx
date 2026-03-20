import {
  Badge,
  Box,
  Button,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { useDeleteAlert } from '../hooks/useAlertMutations';
import type { Alert, AlertType } from '../types/alert';

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  PRICE_ABOVE: 'Price above',
  PRICE_BELOW: 'Price below',
  PERCENT_CHANGE_ABOVE: '% change above',
  PERCENT_CHANGE_BELOW: '% change below',
};

const ALERT_TYPE_COLORS: Record<AlertType, string> = {
  PRICE_ABOVE: 'green',
  PRICE_BELOW: 'red',
  PERCENT_CHANGE_ABOVE: 'blue',
  PERCENT_CHANGE_BELOW: 'orange',
};

function formatThreshold(alert: Alert): string {
  const value = parseFloat(alert.threshold);
  if (alert.type === 'PERCENT_CHANGE_ABOVE' || alert.type === 'PERCENT_CHANGE_BELOW') {
    return `${value}%`;
  }
  return `$${value.toFixed(2)}`;
}

interface StockAlertsListProps {
  symbol: string;
}

function StockAlertsList({ symbol }: StockAlertsListProps) {
  const { data, isLoading } = useAlerts();
  const deleteMutation = useDeleteAlert();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stockAlerts = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((a) => a.symbol === symbol);
  }, [data, symbol]);

  const handleDelete = (alertId: string) => {
    setDeletingId(alertId);
    deleteMutation.mutate(alertId, {
      onSettled: () => setDeletingId(null),
    });
  };

  if (isLoading) {
    return (
      <HStack gap={2} py={2}>
        <Spinner size="sm" />
        <Text fontSize="xs" color="gray.400">Loading alerts...</Text>
      </HStack>
    );
  }

  if (stockAlerts.length === 0) return null;

  return (
    <Box>
      <Text fontSize="sm" fontWeight="semibold" mb={2}>
        Active Alerts ({stockAlerts.length})
      </Text>
      <VStack align="stretch" gap={1.5}>
        {stockAlerts.map((alert) => (
          <HStack
            key={alert.id}
            p={2}
            borderWidth="1px"
            borderRadius="md"
            justify="space-between"
          >
            <HStack gap={2} flex={1} minW={0}>
              <Badge
                size="sm"
                colorPalette={ALERT_TYPE_COLORS[alert.type]}
                whiteSpace="nowrap"
              >
                {ALERT_TYPE_LABELS[alert.type]}
              </Badge>
              <Text fontSize="sm" fontWeight="medium">
                {formatThreshold(alert)}
              </Text>
            </HStack>
            <Button
              size="xs"
              variant="ghost"
              colorPalette="red"
              onClick={() => handleDelete(alert.id)}
              loading={deleteMutation.isPending && deletingId === alert.id}
            >
              Delete
            </Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

export default StockAlertsList;
