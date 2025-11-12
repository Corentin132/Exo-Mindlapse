import vine from '@vinejs/vine'

export const LoginUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().escape(),
    password: vine.string().minLength(6),
  })
)
