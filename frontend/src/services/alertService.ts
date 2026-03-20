import apiClient from './apiClient';
import type {
  AlertsResponse,
  CreateAlertRequest,
  CreateAlertResponse,
  DeleteAlertResponse,
} from '../types/alert';

export const alertService = {
  getAlerts: async (): Promise<AlertsResponse> => {
    const response = await apiClient.get('/api/alerts');
    return response.data;
  },

  createAlert: async (data: CreateAlertRequest): Promise<CreateAlertResponse> => {
    const response = await apiClient.post('/api/alerts', data);
    return response.data;
  },

  deleteAlert: async (alertId: string): Promise<DeleteAlertResponse> => {
    const response = await apiClient.delete(`/api/alerts/${alertId}`);
    return response.data;
  },
};
