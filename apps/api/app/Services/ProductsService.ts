import Database from '@ioc:Kysely/Database'
import type { SelectQueryBuilder } from 'kysely'
import type { Database as DatabaseSchema } from 'database/schema'

export type ProductFilters = {
  name?: string
  minPrice?: number
  maxPrice?: number
  minStock?: number
  maxStock?: number
}

export type ProductPayload = {
  name: string
  price: number
  stock: number
}

export type ProductUpdatePayload = Partial<ProductPayload>

export type PaginationInput = {
  page: number
  perPage: number
}

type ProductQuery = SelectQueryBuilder<DatabaseSchema, 'products', unknown>

export default class ProductsService {
  public async list(pagination: PaginationInput, filters: ProductFilters) {
    const baseQuery = Database.selectFrom('products')
    const filteredQuery = this.applyFilters(baseQuery, filters)

    const [products, totalRow] = await Promise.all([
      filteredQuery
        .selectAll()
        .orderBy('created_at', 'desc')
        .limit(pagination.perPage)
        .offset((pagination.page - 1) * pagination.perPage)
        .execute(),
      filteredQuery
        .select((builder) => builder.fn.countAll<number>().as('count'))
        .executeTakeFirst(),
    ])

    const total = Number(totalRow?.count ?? 0)
    const lastPage = pagination.perPage > 0 ? Math.max(Math.ceil(total / pagination.perPage), 1) : 1

    return {
      meta: {
        total,
        perPage: pagination.perPage,
        page: pagination.page,
        lastPage,
      },
      data: products,
    }
  }

  public async findById(id: number) {
    return Database.selectFrom('products').selectAll().where('id', '=', id).executeTakeFirst()
  }

  public async create(payload: ProductPayload) {
    return Database.insertInto('products')
      .values({
        name: payload.name,
        price: payload.price,
        stock: payload.stock,
      })
      .returningAll()
      .executeTakeFirst()
  }

  public async update(id: number, payload: ProductUpdatePayload) {
    return Database.updateTable('products')
      .set(payload)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()
  }

  public async delete(id: number) {
    const deleted = await Database.deleteFrom('products')
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirst()

    return Boolean(deleted)
  }

  private applyFilters(query: ProductQuery, filters: ProductFilters): ProductQuery {
    let builder = query

    if (filters.name) {
      builder = builder.where('name', 'ilike', `%${filters.name}%`)
    }

    if (typeof filters.minPrice === 'number') {
      builder = builder.where('price', '>=', filters.minPrice)
    }

    if (typeof filters.maxPrice === 'number') {
      builder = builder.where('price', '<=', filters.maxPrice)
    }

    if (typeof filters.minStock === 'number') {
      builder = builder.where('stock', '>=', filters.minStock)
    }

    if (typeof filters.maxStock === 'number') {
      builder = builder.where('stock', '<=', filters.maxStock)
    }

    return builder
  }
}
