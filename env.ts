import { env as loadEnv } from 'custom-env'; // For loading .env files in non-prod environments
import { z } from 'zod'; // Zod is used for runtime schema validation (not just TS compile-time checks)

// Ensure APP_STAGE is set so other logic can read it. Default to 'dev'.
process.env.APP_STAGE = process.env.APP_STAGE || 'dev'; // default to dev if not set

// Convenience booleans based on the stage string so branches below are easier to read.
const isProduction = process.env.APP_STAGE === 'production';
const isDevelopment = process.env.APP_STAGE === 'dev';
const isTest = process.env.APP_STAGE === 'test';


// Load .env files in development and testing. `custom-env` reads files like `.env`,
// `.env.test`, etc. In production we avoid loading local .env files and rely on real
// environment variables provided by the platform.
if (isDevelopment) {
  loadEnv(); // loads the default env file for local development
} else if (isTest) {
  loadEnv('test'); // loads `.env.test` (helpful for CI/test runs)
}

// Zod schema that describes the expected environment variables and enforces
// runtime validation. This protects the app from starting with invalid/missing
// configuration and provides helpful error messages.
const envSchema = z.object({
  // Standard Node environment marker; used by many libraries to change behavior.
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Our simplified stage used across this project: dev/prod/test.
  APP_STAGE: z.enum(['dev', 'production', 'test']).default('dev'),

  // PORT may be provided as a string; coerce to number and default to 3000.
  PORT: z.coerce.number().positive().default(3000),

  // Expect a Postgres connection string. .startsWith enforces the scheme prefix.
  DATABASE_URL: z.string().startsWith('postgresql://'),

  // JWT secret must be long enough for security. Using .min(32) is a practical
  // safeguard against weak secrets.
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),

  // How long JWTs should live; left as a string so values like '7d' are allowed.
  JWT_EXPIRATION: z.string().default('7d'),
  REFRESH_TOKEN_SECRET: z.string().min(32).optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),


  // Bcrypt salt rounds are numeric; coerce from string if necessary and limit
  // to a sensible range to avoid accidental extremes. Default to 12.
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(20).default(12),

  CORS_ORIGIN: z
    .string()
    .or(z.array(z.string()))
    .transform((val) => {
      if (typeof val === 'string') {
        return val.split(',').map((origin) => origin.trim())
      }
      return val
    })
    .default([]),
});

// TypeScript type inferred from the Zod schema — useful for strongly-typed code
// elsewhere in the codebase that consumes `env`.
export type Env = z.infer<typeof envSchema>;

let env: Env;

// Parse and validate process.env against our schema. If validation fails we log
// user-friendly messages and exit the process to avoid running with bad config.
try {
  env = envSchema.parse(process.env);
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log('Invalid environment variables:');
    // `flatten` provides a compact representation of issues grouped by key.
    console.log(JSON.stringify(e.flatten(), null, 2));

    // Print each issue in a human-readable way (key: message).
    e.issues.forEach((issue) => {
      console.log(`- ${issue.path.join('.')} : ${issue.message}`);
    });
    // Stop startup - incorrect env is a fatal condition for most apps.
    process.exit(1);
  }
  // Re-throw unknown errors (not ZodErrors) so they surface normally.
  throw e;
}

// Small helper functions that other modules can import. They read from the
// validated `env` object instead of raw process.env to guarantee types.
export const isProd = () => env.NODE_ENV === 'production';
export const isDev = () => env.NODE_ENV === 'development';
export const isTesting = () => env.NODE_ENV === 'test';

// Export the validated env object both as a named and default export. This makes
// importing flexible depending on project preferences.
export { env };
export default env;