import { z } from 'zod';

const configSchema = z.object({
  PORT: z.preprocess((data) => parseInt(String(data), 10), z.number()),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  CLIENT_URL: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const CONFIG: z.infer<typeof configSchema> = configSchema.parse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,
});
