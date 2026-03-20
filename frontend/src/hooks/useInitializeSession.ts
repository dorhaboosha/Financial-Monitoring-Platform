import { useEffect, useRef, useState } from 'react';
import { sessionService } from '../services/sessionService';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 1500;

export const useInitializeSession = () => {
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          await sessionService.initializeSession();
          setReady(true);
          return;
        } catch {
          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          } else {
            console.error('Failed to initialize session after', MAX_RETRIES, 'attempts');
          }
        }
      }
    };

    void init();
  }, []);

  return { ready };
};
