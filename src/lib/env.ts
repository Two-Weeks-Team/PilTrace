import { z } from 'zod'

const envSchema = z.object({
  // OpenAI
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL').optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

// 환경변수 파싱 및 검증
const _parsed = envSchema.safeParse(process.env)

if (!_parsed.success) {
  const missing = _parsed.error.issues
    .map((e: z.ZodIssue) => `  ${e.path.join('.')}: ${e.message}`)
    .join('\n')
  throw new Error(`Missing or invalid environment variables:\n${missing}\n\nSee .env.example for required variables.`)
}

export const env = _parsed.data
export type Env = z.infer<typeof envSchema>
