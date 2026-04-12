import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from '../hooks/useNotificationMutations';
import type { Notification } from '../types/notification';

function BellIcon({ hasUnread }: { hasUnread: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={hasUnread ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
  isMarking,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  isMarking: boolean;
}) {
  const date = new Date(notification.triggeredAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Box
      p={3}
      borderBottomWidth="1px"
      bg={notification.isRead ? 'white' : 'blue.50'}
      _last={{ borderBottom: 'none' }}
    >
      <HStack justify="space-between" align="start" gap={2}>
        <VStack align="start" gap={0.5} flex={1} minW={0}>
          <HStack gap={1.5}>
            <Badge size="xs" colorPalette="blue" variant="subtle">
              {notification.symbol}
            </Badge>
            {!notification.isRead && (
              <Box w="6px" h="6px" borderRadius="full" bg="blue.500" flexShrink={0} />
            )}
          </HStack>
          <Text fontSize="sm" lineClamp={2}>
            {notification.message}
          </Text>
          <Text fontSize="xs" color="gray.400">
            {date}
          </Text>
        </VStack>
        {!notification.isRead && (
          <Button
            size="xs"
            variant="ghost"
            colorPalette="blue"
            onClick={() => onMarkRead(notification.id)}
            loading={isMarking}
            flexShrink={0}
          >
            Mark read
          </Button>
        )}
      </HStack>
    </Box>
  );
}

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useNotifications();
  const markOneMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Box position="relative" ref={containerRef}>
      <Box position="relative" display="inline-flex">
        <IconButton
          aria-label="Notifications"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen((prev) => !prev)}
          color={unreadCount > 0 ? 'blue.500' : 'gray.500'}
        >
          <BellIcon hasUnread={unreadCount > 0} />
        </IconButton>
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-1"
            right="-1"
            size="xs"
            colorPalette="red"
            borderRadius="full"
            minW="18px"
            textAlign="center"
            pointerEvents="none"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Box>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          right={0}
          w={{ base: 'calc(100vw - 32px)', sm: '340px' }}
          maxW="340px"
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
          zIndex={50}
          overflow="hidden"
        >
          <HStack
            px={3}
            py={2.5}
            borderBottomWidth="1px"
            justify="space-between"
            bg="gray.50"
          >
            <Text fontWeight="semibold" fontSize="sm">
              Notifications
              {unreadCount > 0 && (
                <Text as="span" color="gray.400" fontWeight="normal">
                  {' '}({unreadCount} unread)
                </Text>
              )}
            </Text>
            {unreadCount > 0 && (
              <Button
                size="xs"
                variant="ghost"
                colorPalette="blue"
                onClick={() => markAllMutation.mutate()}
                loading={markAllMutation.isPending}
              >
                Mark all read
              </Button>
            )}
          </HStack>

          <Box maxH="360px" overflowY="auto">
            {isLoading ? (
              <VStack py={8}>
                <Spinner size="sm" />
                <Text fontSize="sm" color="gray.400">Loading...</Text>
              </VStack>
            ) : notifications.length === 0 ? (
              <VStack py={8} gap={2}>
                <Text fontSize="sm" color="gray.400">No notifications yet.</Text>
                <Text fontSize="xs" color="gray.300">
                  Alerts you create will appear here when triggered.
                </Text>
              </VStack>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={(id) => markOneMutation.mutate(id)}
                  isMarking={markOneMutation.isPending && markOneMutation.variables === n.id}
                />
              ))
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default NotificationBell;
