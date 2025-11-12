import vine from '@vinejs/vine'

export const CreateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).escape(),
    price: vine.number().positive(),
    stock: vine.number().min(0),
  })
)

export const UpdateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).escape().optional(),
    price: vine.number().positive().optional(),
    stock: vine.number().min(0).optional(),
  })
)
