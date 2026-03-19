import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import type { StockSearchItem } from '../types/market';
import { useStockSearch } from '../hooks/useStockSearch';
import { useStockSearchSuggestions } from '../hooks/useStockSearchSuggestions';

interface WatchlistSearchBarProps {
  onAdd: (symbol: string) => void;
  isAdding?: boolean;
}

function WatchlistSearchBar({
  onAdd,
  isAdding = false,
}: WatchlistSearchBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const trimmedQuery = inputValue.trim();
  const shouldSearch = trimmedQuery.length > 0;

  const suggestionsQuery = useStockSearchSuggestions();
  const searchQuery = useStockSearch(trimmedQuery, shouldSearch);

  const displayedOptions = useMemo<StockSearchItem[]>(() => {
    if (!shouldSearch) {
      return suggestionsQuery.data?.data ?? [];
    }

    return searchQuery.data?.data ?? [];
  }, [shouldSearch, suggestionsQuery.data, searchQuery.data]);

  const isLoading =
    (!shouldSearch && suggestionsQuery.isLoading) ||
    (shouldSearch && searchQuery.isLoading);

  const showDropdown = isFocused && (isLoading || displayedOptions.length > 0);

  const handleSelectStock = (stock: StockSearchItem) => {
    setInputValue(stock.symbol);
    setIsFocused(false);
  };

  const handleAddClick = () => {
    const symbol = inputValue.trim();

    if (!symbol) {
      return;
    }

    onAdd(symbol);
    setInputValue('');
    setIsFocused(false);
  };

  return (
    <Box position="relative" width="100%">
      <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
        <Input
          placeholder="Search stock by symbol or company name"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
            }, 100);
          }}
          bg="white"
        />

        <Button
          colorScheme="blue"
          onClick={handleAddClick}
          loading={isAdding}
          minW={{ md: '120px' }}
        >
          Add
        </Button>
      </Stack>

      {showDropdown && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={2}
          bg="white"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          zIndex={10}
          maxH="300px"
          overflowY="auto"
        >
          {isLoading ? (
            <Box p={3}>
              <Text fontSize="sm" color="gray.500">
                Loading...
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" gap={0}>
              {displayedOptions.map((stock) => (
                <Box
                  key={stock.symbol}
                  px={4}
                  py={3}
                  cursor="pointer"
                  _hover={{ bg: 'gray.50' }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelectStock(stock);
                  }}
                >
                  <Text fontWeight="bold">{stock.displaySymbol}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {stock.description}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {stock.type}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
}

export default WatchlistSearchBar;