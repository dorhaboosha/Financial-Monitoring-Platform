import { Alert, AlertType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { alertRepository } from '../repositories/alertRepository';
import { notificationRepository } from '../repositories/notificationRepository';
import { finnhubService } from './finnhubService';
import { FinnhubQuoteResponse } from '../types/finnhub';

const DEDUP_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const ALERT_TYPE_MESSAGES: Record<AlertType, (symbol: string, threshold: number, current: number) => string> = {
  PRICE_ABOVE: (s, t, c) => `${s} price is now $${c.toFixed(2)}, above your $${t.toFixed(2)} target`,
  PRICE_BELOW: (s, t, c) => `${s} price is now $${c.toFixed(2)}, below your $${t.toFixed(2)} target`,
  PERCENT_CHANGE_ABOVE: (s, t, c) => `${s} daily change is ${c >= 0 ? '+' : ''}${c.toFixed(2)}%, above your ${t}% threshold`,
  PERCENT_CHANGE_BELOW: (s, t, c) => `${s} daily change is ${c >= 0 ? '+' : ''}${c.toFixed(2)}%, below your -${t}% threshold`,
};

function evaluateAlert(alert: Alert, quote: FinnhubQuoteResponse): boolean {
  const threshold = (alert.threshold as unknown as Decimal).toNumber();

  switch (alert.type) {
    case 'PRICE_ABOVE':
      return quote.c > threshold;
    case 'PRICE_BELOW':
      return quote.c < threshold;
    case 'PERCENT_CHANGE_ABOVE':
      return quote.dp > threshold;
    case 'PERCENT_CHANGE_BELOW':
      return quote.dp < -threshold;
    default:
      return false;
  }
}

function getRelevantValue(alert: Alert, quote: FinnhubQuoteResponse): number {
  if (alert.type === 'PERCENT_CHANGE_ABOVE' || alert.type === 'PERCENT_CHANGE_BELOW') {
    return quote.dp;
  }
  return quote.c;
}

export const alertCheckerService = {
  checkAlerts: async (): Promise<number> => {
    const alerts = await alertRepository.findAllActive();

    if (alerts.length === 0) return 0;

    const symbolMap = new Map<string, Alert[]>();
    for (const alert of alerts) {
      const list = symbolMap.get(alert.symbol) ?? [];
      list.push(alert);
      symbolMap.set(alert.symbol, list);
    }

    let triggeredCount = 0;

    for (const [symbol, symbolAlerts] of symbolMap) {
      let quote: FinnhubQuoteResponse;

      try {
        quote = await finnhubService.getQuote(symbol);
      } catch (error) {
        console.error(`Alert checker: failed to fetch quote for ${symbol}`, error);
        continue;
      }

      if (!quote || quote.c === 0) continue;

      for (const alert of symbolAlerts) {
        try {
          if (!evaluateAlert(alert, quote)) continue;

          const recent = await notificationRepository.findRecentByAlertId(alert.id, DEDUP_WINDOW_MS);
          if (recent) continue;

          const threshold = (alert.threshold as unknown as Decimal).toNumber();
          const currentValue = getRelevantValue(alert, quote);
          const message = ALERT_TYPE_MESSAGES[alert.type](symbol, threshold, currentValue);

          await notificationRepository.create({
            userId: alert.userId,
            alertId: alert.id,
            symbol,
            message,
          });

          triggeredCount++;
        } catch (error) {
          console.error(`Alert checker: failed to evaluate alert ${alert.id}`, error);
        }
      }
    }

    return triggeredCount;
  },
};
