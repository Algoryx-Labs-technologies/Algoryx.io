import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4001'),
  API_VERSION: z.string().default('v2'),
  /** Comma-separated browser origins allowed to call this API cross-origin */
  CORS_ORIGIN: z
    .string()
    .default(
      'http://localhost:8080,http://localhost:5173,http://localhost:5174,http://localhost:5175',
    ),
  ADMIN_ID: z.string().min(1, 'ADMIN_ID is required'),
  ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD is required'),
  ADMIN_MPIN: z.string().min(4, 'ADMIN_MPIN must be at least 4 characters'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  MONGODB_URI: z
    .string()
    .url()
    .default('mongodb://127.0.0.1:27017/Algoryx'),
  /** Comma-separated resolvers for mongodb+srv (fixes querySrv on some Windows/VPN DNS) */
  MONGODB_DNS_SERVERS: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missingVars = result.error.errors.map(
      (e) => `${e.path.join('.')}: ${e.message}`,
    );
    throw new Error(
      `Missing or invalid environment variables:\n${missingVars.join('\n')}`,
    );
  }
  return result.data;
}

export const env = validateEnv();
