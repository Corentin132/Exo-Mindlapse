import vine from '@vinejs/vine'

export const RegisterUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).escape(),
    email: vine.string().trim().email(),
    password: vine.string().minLength(6),
  })
)
