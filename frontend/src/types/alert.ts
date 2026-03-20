export type AlertType =
  | 'PRICE_ABOVE'
  | 'PRICE_BELOW'
  | 'PERCENT_CHANGE_ABOVE'
  | 'PERCENT_CHANGE_BELOW';

export interface Alert {
  id: string;
  userId: string;
  symbol: string;
  type: AlertType;
  threshold: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AlertsResponse {
  success: boolean;
  data: Alert[];
}

export interface CreateAlertRequest {
  symbol: string;
  type: AlertType;
  threshold: number;
}

export interface CreateAlertResponse {
  success: boolean;
  data: Alert;
}

export interface DeleteAlertResponse {
  success: boolean;
  message: string;
}
