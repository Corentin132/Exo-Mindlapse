// eslint-disable-next-line @unicorn/filename-case
import type { HttpContext } from '@adonisjs/core/http'
import { db } from '../../start/kysely.js'

const PRODUCT_SELECTION = ['id', 'name', 'price', 'stock', 'createdAt', 'updatedAt'] as const

function parseProductId(rawId: string | number | undefined) {
  const id = Number(rawId)
  return Number.isFinite(id) ? id : null
}

export default class ProductsController {
  public async index({ response }: HttpContext) {
    console.log('Fetching products list')
    const products = await db
      .selectFrom('products')
      .select(PRODUCT_SELECTION)
      .orderBy('createdAt', 'desc')
      .execute()

    return response.ok({ products })
  }

  public async store({ request, response }: HttpContext) {
    const { CreateProductValidator } = await import('#validators/product')
    const payload = await request.validateUsing(CreateProductValidator)

    const timestamp = new Date()
    const product = await db
      .insertInto('products')
      .values({
        name: payload.name,
        price: payload.price,
        stock: payload.stock,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning(PRODUCT_SELECTION)
      .executeTakeFirst()

    return response.created({ product, message: 'Product created successfully.' })
  }

  public async show({ params, response }: HttpContext) {
    const productId = parseProductId(params.id)

    if (productId === null) {
      return response.badRequest({ message: 'Invalid product id.' })
    }

    const product = await db
      .selectFrom('products')
      .select(PRODUCT_SELECTION)
      .where('id', '=', productId)
      .executeTakeFirst()

    if (!product) {
      return response.notFound({ message: 'Product not found.' })
    }

    return response.ok({ product })
  }

  public async update({ params, request, response }: HttpContext) {
    const productId = parseProductId(params.id)

    if (productId === null) {
      return response.badRequest({ message: 'Invalid product id.' })
    }

    const { UpdateProductValidator } = await import('#validators/product')
    const payload = await request.validateUsing(UpdateProductValidator)

    if (!payload.name && !payload.price && !payload.stock && payload.stock !== 0) {
      return response.badRequest({ message: 'At least one field must be provided.' })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }

    if (payload.name !== undefined) {
      updates.name = payload.name
    }

    if (payload.price !== undefined) {
      updates.price = payload.price
    }

    if (payload.stock !== undefined) {
      updates.stock = payload.stock
    }

    const product = await db
      .updateTable('products')
      .set(updates)
      .where('id', '=', productId)
      .returning(PRODUCT_SELECTION)
      .executeTakeFirst()

    if (!product) {
      return response.notFound({ message: 'Product not found.' })
    }

    return response.ok({ product })
  }

  public async destroy({ params, response }: HttpContext) {
    const productId = parseProductId(params.id)

    if (productId === null) {
      return response.badRequest({ message: 'Invalid product id.' })
    }

    const deleted = await db
      .deleteFrom('products')
      .where('id', '=', productId)
      .returning(['id'] as const)
      .executeTakeFirst()

    if (!deleted) {
      return response.notFound({ message: 'Product not found.' })
    }

    return response.ok({ message: 'Product deleted successfully.' })
  }
}
