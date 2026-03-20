import apiClient from './apiClient';

export const sessionService = {
  initializeSession: async () => {
    const response = await apiClient.post('/api/session/init', {});
    return response.data;
  },
};
