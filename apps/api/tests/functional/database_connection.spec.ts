import { test } from '@japa/runner'
import { sql } from 'kysely'
import Database from '@ioc:Kysely/Database'

test.group('Database connection', () => {
  test('executes a simple query', async ({ assert }) => {
    const result = await sql<{ value: number }>`select 1 as value`.execute(Database)

    assert.isAtLeast(result.rows.length, 1)
    assert.strictEqual(result.rows[0]?.value, 1)
  })
})
