// eslint-disable-next-line @unicorn/filename-case
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { randomUUID } from 'node:crypto'
import { db } from '../../start/kysely.js'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const { RegisterUserValidator } = await import('#validators/register_user')
    const payload = await request.validateUsing(RegisterUserValidator)

    const existingUser = await db
      .selectFrom('users')
      .select('id')
      .where('email', '=', payload.email)
      .executeTakeFirst()

    if (existingUser) {
      return response.conflict({
        message: 'An account with this email already exists.',
      })
    }

    const now = new Date()
    const createdUser = await db
      .insertInto('users')
      .values({
        id: randomUUID(),
        name: payload.name,
        email: payload.email,
        password: await hash.make(payload.password),
        token: null,
        createdAt: now,
      })
      .returning(['id', 'name', 'email', 'createdAt'] as const)
      .executeTakeFirst()

    if (!createdUser) {
      return response.internalServerError({ message: 'Unable to create the user account.' })
    }

    return response.created({
      user: createdUser,
      message: 'Account created successfully.',
    })
  }

  public async login({ request, response }: HttpContext) {
    const { LoginUserValidator } = await import('#validators/login_user')
    const payload = await request.validateUsing(LoginUserValidator)

    const user = await db
      .selectFrom('users')
      .select(['id', 'name', 'email', 'password'] as const)
      .where('email', '=', payload.email)
      .executeTakeFirst()

    if (!user) {
      return response.unauthorized({ message: 'Invalid credentials.' })
    }

    const isPasswordValid = await hash.verify(user.password, payload.password)

    if (!isPasswordValid) {
      return response.unauthorized({ message: 'Invalid credentials.' })
    }

    const token = randomUUID()
    await db
      .updateTable('users')
      .set({ token, updatedAt: new Date() })
      .where('id', '=', user.id)
      .execute()

    return response.ok({
      token,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  }

  public async logout({ request, response }: HttpContext) {
    const authorization = request.header('authorization')

    if (!authorization) {
      return response.unauthorized({ message: 'Authentication required.' })
    }

    const matches = authorization.match(/^Bearer\s+(.+)$/i)
    const token = matches?.[1]?.trim()

    if (!token) {
      return response.unauthorized({ message: 'Authentication required.' })
    }

    await db
      .updateTable('users')
      .set({ token: null, updatedAt: new Date() })
      .where('token', '=', token)
      .execute()

    return response.noContent()
  }
}
