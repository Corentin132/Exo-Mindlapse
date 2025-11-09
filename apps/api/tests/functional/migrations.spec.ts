import { test } from '@japa/runner'
import { sql } from 'kysely'
import Database from '@ioc:Kysely/Database'
import { up, down } from '../../database/migrations/0000_create_schema'

test.group('Migrations', (group) => {
  group.each.setup(async () => {
    await down(Database)
  })

  group.each.teardown(async () => {
    await down(Database)
  })

  test('creates users and products tables with expected columns', async ({ assert }) => {
    await up(Database)

    const usersTable = await sql<{ regclass: string | null }>`select to_regclass('public.users') as regclass`.execute(Database)
    const productsTable = await sql<{ regclass: string | null }>`select to_regclass('public.products') as regclass`.execute(Database)

    assert.exists(usersTable.rows[0]?.regclass)
    assert.exists(productsTable.rows[0]?.regclass)

    const productColumns = await sql<{ column_name: string }>`
      select column_name
      from information_schema.columns
      where table_schema = 'public' and table_name = 'products'
      order by column_name
    `.execute(Database)

    const userColumns = await sql<{ column_name: string }>`
      select column_name
      from information_schema.columns
      where table_schema = 'public' and table_name = 'users'
      order by column_name
    `.execute(Database)

    assert.deepEqual(
      productColumns.rows.map((row) => row.column_name),
      ['created_at', 'id', 'name', 'price', 'stock']
    )

    assert.deepEqual(
      userColumns.rows.map((row) => row.column_name),
      ['created_at', 'email', 'id', 'password']
    )
  })
})
