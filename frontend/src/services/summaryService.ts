import apiClient from './apiClient';
import type { SummaryResponse } from '../types/summary';

export const summaryService = {
  getSummary: async (): Promise<SummaryResponse> => {
    const response = await apiClient.get('/api/summary');
    return response.data;
  },
};
