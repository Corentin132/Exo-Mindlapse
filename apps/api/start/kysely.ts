import './env.js'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import type { Database } from '../database/type.js'
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME,
})

export const db = new Kysely<Database>({ dialect: new PostgresDialect({ pool }) })
export { pool }
