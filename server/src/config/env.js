import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CLIENT_ORIGIN: z
    .string()
    .default('http://localhost:5173,http://localhost:5174')
    .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/caretrack'),
  // OpenRouter (AI summarization). Optional so the API can run without AI.
  OPENROUTER_API_KEY: z
    .string()
    .optional()
    .transform((value) => (value && value.trim() ? value.trim() : undefined)),
  OPENROUTER_MODEL: z
    .string()
    .optional()
    .transform((value) => (value && value.trim() ? value.trim() : undefined)),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('[env] Invalid environment configuration:');
  for (const issue of result.error.issues) {
    console.error(`  - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = result.data;
