import axios from 'axios';

export const sessionService = {
  initializeSession: async () => {
    const response = await axios.post(
      'http://localhost:5000/api/session/init',
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  },
};