import './env.js'
import { Kysely, PostgresDialect } from 'kysely'
import type { Pool } from 'pg'
import { Pool as PgPool } from 'pg'
import type { Database } from '../database/type.js'

const isTestEnvironment = process.env.NODE_ENV === 'test'

let pool: Pool

if (isTestEnvironment) {
  const { newDb } = await import('pg-mem')
  const memoryDb = newDb({ autoCreateForeignKeyIndices: true })
  const { Pool: MemoryPool } = memoryDb.adapters.createPg()
  pool = new MemoryPool() as unknown as Pool
} else {
  pool = new PgPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME,
  })
}

export const db = new Kysely<Database>({ dialect: new PostgresDialect({ pool }) })
export { pool }
