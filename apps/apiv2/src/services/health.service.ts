import { env } from '@/config/env';

export interface HealthStatus {
  status: 'ok';
  timestamp: string;
  version: string;
  environment: string;
}

export const getHealthStatus = (): HealthStatus => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: env.API_VERSION,
  environment: env.NODE_ENV,
});
