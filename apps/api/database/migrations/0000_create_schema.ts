import type { Kysely } from 'kysely'
import { sql } from 'kysely'
import type { Database } from '../type.js'
export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable('products')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('price', 'numeric', (col) => col.notNull())
    .addColumn('stock', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.unique())
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable('products').ifExists().execute()
  await db.schema.dropTable('users').ifExists().execute()
}
