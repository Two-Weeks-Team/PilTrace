import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// DATABASE_URL이 없으면 null 반환 (빌드 타임 안전)
const createDb = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    return null
  }
  
  const client = postgres(connectionString, {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
  })
  
  return drizzle(client, { schema })
}

// DB 인스턴스 (런타임에 연결)
export const db = createDb()
export { schema }
export type DB = NonNullable<ReturnType<typeof createDb>>
