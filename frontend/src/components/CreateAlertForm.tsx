import {
  Box,
  Button,
  HStack,
  Input,
  NativeSelect,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useCreateAlert } from '../hooks/useAlertMutations';
import type { AlertType } from '../types/alert';

const ALERT_TYPE_OPTIONS: { value: AlertType; label: string }[] = [
  { value: 'PRICE_ABOVE', label: 'Price goes above' },
  { value: 'PRICE_BELOW', label: 'Price drops below' },
  { value: 'PERCENT_CHANGE_ABOVE', label: 'Daily % change above' },
  { value: 'PERCENT_CHANGE_BELOW', label: 'Daily % change below' },
];

interface CreateAlertFormProps {
  symbol: string;
}

function CreateAlertForm({ symbol }: CreateAlertFormProps) {
  const [alertType, setAlertType] = useState<AlertType>('PRICE_ABOVE');
  const [threshold, setThreshold] = useState('');
  const createMutation = useCreateAlert();

  const isPercent = alertType === 'PERCENT_CHANGE_ABOVE' || alertType === 'PERCENT_CHANGE_BELOW';
  const parsedThreshold = parseFloat(threshold);
  const isValid = !isNaN(parsedThreshold) && parsedThreshold > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    createMutation.mutate(
      { symbol, type: alertType, threshold: parsedThreshold },
      {
        onSuccess: () => {
          setThreshold('');
        },
      },
    );
  };

  return (
    <Box>
      <Text fontSize="sm" fontWeight="semibold" mb={2}>
        Create Alert
      </Text>
      <VStack align="stretch" gap={2}>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            value={alertType}
            onChange={(e) => setAlertType(e.target.value as AlertType)}
          >
            {ALERT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>

        <HStack gap={2}>
          <Input
            size="sm"
            type="number"
            placeholder={isPercent ? 'e.g. 5' : 'e.g. 150.00'}
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            {isPercent ? '%' : 'USD'}
          </Text>
        </HStack>

        {createMutation.isError && (
          <Text fontSize="xs" color="red.500">
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Failed to create alert'}
          </Text>
        )}

        {createMutation.isSuccess && (
          <Text fontSize="xs" color="green.500">
            Alert created successfully!
          </Text>
        )}

        <Button
          size="sm"
          colorPalette="blue"
          onClick={handleSubmit}
          disabled={!isValid}
          loading={createMutation.isPending}
        >
          Create Alert
        </Button>
      </VStack>
    </Box>
  );
}

export default CreateAlertForm;
