export interface Notification {
  id: string;
  userId: string;
  alertId: string;
  symbol: string;
  message: string;
  isRead: boolean;
  triggeredAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

export interface MarkReadResponse {
  success: boolean;
  message: string;
}
