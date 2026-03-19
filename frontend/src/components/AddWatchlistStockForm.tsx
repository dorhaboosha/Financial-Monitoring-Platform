import { Button, HStack, Input } from '@chakra-ui/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface AddWatchlistStockFormProps {
  onAdd: (symbol: string) => void;
  isAdding?: boolean;
}

function AddWatchlistStockForm({
  onAdd,
  isAdding = false,
}: AddWatchlistStockFormProps) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedSymbol = symbol.trim();

    if (!trimmedSymbol) {
      return;
    }

    onAdd(trimmedSymbol);
    setSymbol('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <HStack>
        <Input
          placeholder="Enter stock symbol (e.g. AAPL)"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
        />
        <Button type="submit" colorScheme="blue" loading={isAdding}>
          Add
        </Button>
      </HStack>
    </form>
  );
}

export default AddWatchlistStockForm;