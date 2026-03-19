import { useEffect } from 'react';
import { sessionService } from '../services/sessionService';

export const useInitializeSession = () => {
  useEffect(() => {
    const init = async () => {
      try {
        await sessionService.initializeSession();
      } catch (error) {
        console.error('Failed to initialize anonymous session:', error);
      }
    };

    void init();
  }, []);
};