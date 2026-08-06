import Zod from 'zod';

/**
 * Environment variable schema validation
 * Ensures all required env vars are present and properly typed on startup
 */
const envSchema = Zod.object({
  NODE_ENV: Zod.enum(['development', 'production', 'test']).default('development'),
  PORT: Zod.string().pipe(Zod.coerce.number().int().positive()).default('5173'),
  DATABASE_URL: Zod.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),
  SESSION_SECRET: Zod.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  API_URL: Zod.string().url('API_URL must be a valid URL').optional(),
  BASE_PATH: Zod.string().default('/'),
});

export type Environment = Zod.infer<typeof envSchema>;

/**
 * Parse and validate environment variables on startup
 * Fails fast if any required variable is missing or invalid
 */
export function validateEnvironment(): Environment {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof Zod.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnvironment();
