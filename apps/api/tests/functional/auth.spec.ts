import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'
import { randomUUID } from 'node:crypto'
import { db } from '#start/kysely'

test.group('Auth endpoints', (group) => {
  group.each.setup(async () => {
    await db.deleteFrom('products').execute()
    await db.deleteFrom('users').execute()
  })

  test('registers a new user and stores hashed password', async ({ client, assert }) => {
    const payload = { name: 'Neo Tester', email: 'neo@example.com', password: 'pass1234' }

    const response = await client.post('/api/register').json(payload)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Account created successfully.',
      user: {
        name: payload.name,
        email: payload.email,
      },
    })

    const storedUser = await db
      .selectFrom('users')
      .select(['email', 'password', 'token'])
      .where('email', '=', payload.email)
      .executeTakeFirst()

    assert.exists(storedUser)
    assert.isNull(storedUser?.token)
    assert.notEqual(storedUser?.password, payload.password)

    const isPasswordValid = await hash.verify(storedUser!.password, payload.password)
    assert.isTrue(isPasswordValid)
  })

  test('rejects duplicate registrations by email', async ({ client }) => {
    await createUser({ email: 'existing@example.com' })

    const response = await client.post('/api/register').json({
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'another123',
    })

    response.assertStatus(409)
    response.assertBodyContains({ message: 'An account with this email already exists.' })
  })

  test('logs in a user with valid credentials', async ({ client, assert }) => {
    const userFixture = await createUser({
      email: 'login@example.com',
      password: 'secret123',
    })

    const response = await client.post('/api/login').json({
      email: userFixture.email,
      password: userFixture.plainPassword,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      tokenType: 'Bearer',
      user: {
        id: userFixture.id,
        name: userFixture.name,
        email: userFixture.email,
      },
    })

    const { token } = response.body()
    assert.isString(token)

    const storedUser = await db
      .selectFrom('users')
      .select(['token'])
      .where('id', '=', userFixture.id)
      .executeTakeFirst()

    assert.equal(storedUser?.token, token)
  })

  test('rejects login when password is incorrect', async ({ client, assert }) => {
    const userFixture = await createUser({
      email: 'wrongpass@example.com',
      password: 'correct123',
    })

    const response = await client.post('/api/login').json({
      email: userFixture.email,
      password: 'incorrect123',
    })

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Invalid credentials.' })

    const storedUser = await db
      .selectFrom('users')
      .select(['token'])
      .where('id', '=', userFixture.id)
      .executeTakeFirst()

    assert.isNull(storedUser?.token)
  })

  test('rejects login for unknown user', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'ghost@example.com',
      password: 'whatever123',
    })

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Invalid credentials.' })
  })
})

interface CreateUserOverrides {
  id?: string
  name?: string
  email?: string
  password?: string
}

async function createUser(overrides: CreateUserOverrides = {}) {
  const now = new Date()
  const id = overrides.id ?? randomUUID()
  const email = overrides.email ?? `user_${Math.random().toString(36).slice(2, 10)}@example.com`
  const name = overrides.name ?? 'Fixture User'
  const plainPassword = overrides.password ?? 'SuperSecret123'
  const hashedPassword = await hash.make(plainPassword)

  const user = await db
    .insertInto('users')
    .values({
      id,
      name,
      email,
      password: hashedPassword,
      token: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning(['id', 'name', 'email'] as const)
    .executeTakeFirst()

  if (!user) {
    throw new Error('Unable to create user fixture')
  }

  return { ...user, plainPassword }
}
