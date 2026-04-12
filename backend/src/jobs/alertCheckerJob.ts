import cron from 'node-cron';
import { alertCheckerService } from '../services/alertCheckerService';

let isRunning = false;

export const startAlertCheckerJob = () => {
  cron.schedule(
    '* * * * *',
    async () => {
      if (isRunning) {
        console.log('[AlertChecker] Previous run still in progress, skipping');
        return;
      }

      isRunning = true;

      try {
        const triggered = await alertCheckerService.checkAlerts();

        if (triggered > 0) {
          console.log(`[AlertChecker] Triggered ${triggered} notification(s)`);
        }
      } catch (error) {
        console.error('[AlertChecker] Job failed:', error);
      } finally {
        isRunning = false;
      }
    },
    { noOverlap: true },
  );

  console.log('[AlertChecker] Cron job scheduled (every minute)');
};
