import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { db } from '../../start/kysely.js'

export default class AuthMiddleware {
  public async handle({ request, response }: HttpContext, next: NextFn) {
    const authorization = request.header('authorization')
    if (!authorization) {
      return response.header('WWW-Authenticate', 'Bearer').unauthorized({
        message: 'Authentication required.',
      })
    }

    const matches = authorization.match(/^Bearer\s+(.+)$/i)
    const token = matches?.[1]?.trim()

    if (!token) {
      return response.header('WWW-Authenticate', 'Bearer').unauthorized({
        message: 'Authentication required.',
      })
    }

    const user = await db
      .selectFrom('users')
      .select(['id', 'email', 'name'] as const)
      .where('token', '=', token)
      .executeTakeFirst()

    if (!user) {
      return response.header('WWW-Authenticate', 'Bearer').unauthorized({
        message: 'Authentication required.',
      })
    }

    await next()
  }
}
