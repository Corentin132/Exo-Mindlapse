import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ProductsService, {
  type ProductFilters,
  type ProductPayload,
  type ProductUpdatePayload,
} from 'App/Services/ProductsService'

export default class ProductsController {
  private service = new ProductsService()

  public async index({ request }: HttpContextContract) {
    const pageInput = this.toOptionalNumber(request.input('page', 1)) ?? 1
    const limitInput = this.toOptionalNumber(request.input('limit', 10)) ?? 10
    const page = pageInput > 0 ? Math.trunc(pageInput) : 1
    const perPage = Math.min(Math.max(Math.trunc(limitInput), 1), 50)

    const filters: ProductFilters = {
      name: (request.input('name') as string | undefined)?.trim() || undefined,
      minPrice: this.toOptionalNumber(request.input('minPrice') ?? request.input('min_price')),
      maxPrice: this.toOptionalNumber(request.input('maxPrice') ?? request.input('max_price')),
      minStock: this.toOptionalNumber(request.input('minStock') ?? request.input('min_stock')),
      maxStock: this.toOptionalNumber(request.input('maxStock') ?? request.input('max_stock')),
    }

    return this.service.list({ page, perPage }, filters)
  }

  public async show({ params, response }: HttpContextContract) {
    const id = this.parseId(params.id)
    if (id === null) {
      return response.badRequest({ message: 'Invalid product identifier.' })
    }

    const product = await this.service.findById(id)

    if (!product) {
      return response.notFound({ message: 'Product not found.' })
    }

    return product
  }

  public async store({ request, response }: HttpContextContract) {
    const createProductSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(255)]),
      price: schema.number([rules.unsigned()]),
      stock: schema.number([rules.unsigned()]),
    })

    const payload = await request.validate({ schema: createProductSchema })

    const product = await this.service.create(payload as ProductPayload)

    if (!product) {
      return response.internalServerError({ message: 'Unable to create product.' })
    }

    return response.created(product)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const id = this.parseId(params.id)
    if (id === null) {
      return response.badRequest({ message: 'Invalid product identifier.' })
    }

    const updateProductSchema = schema.create({
      name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      price: schema.number.optional([rules.unsigned()]),
      stock: schema.number.optional([rules.unsigned()]),
    })

    const payload = await request.validate({ schema: updateProductSchema })

    if (Object.keys(payload).length === 0) {
      return response.badRequest({ message: 'No data provided for update.' })
    }

    const product = await this.service.update(id, payload as ProductUpdatePayload)

    if (!product) {
      return response.notFound({ message: 'Product not found.' })
    }

    return product
  }

  public async destroy({ params, response }: HttpContextContract) {
    const id = this.parseId(params.id)
    if (id === null) {
      return response.badRequest({ message: 'Invalid product identifier.' })
    }

    const deleted = await this.service.delete(id)

    if (!deleted) {
      return response.notFound({ message: 'Product not found.' })
    }

    return response.noContent()
  }

  private parseId(rawId: unknown): number | null {
    const id = this.toOptionalNumber(rawId)
    if (typeof id === 'number' && Number.isInteger(id) && id > 0) {
      return id
    }

    return null
  }

  private toOptionalNumber(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined
    }

    const num = typeof value === 'number' ? value : Number(value)

    return Number.isFinite(num) ? num : undefined
  }
}
