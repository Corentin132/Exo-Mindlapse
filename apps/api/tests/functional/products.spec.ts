import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'
import { db } from '#start/kysely'

const AUTH_TOKEN = 'test-token'
const AUTH_HEADERS = { Authorization: `Bearer ${AUTH_TOKEN}` }

interface ProductOverrides {
  name?: string
  price?: number
  stock?: number
}

test.group('Products endpoints', (group) => {
  group.each.setup(async () => {
    await db.deleteFrom('products').execute()
    await db.deleteFrom('users').execute()
    await seedAuthUser()
  })

  test('lists products when none exist', async ({ client, assert }) => {
    const response = await client.get('/api/products').headers(AUTH_HEADERS)

    response.assertStatus(200)
    assert.deepEqual(response.body().products, [])
  })

  test('lists existing products ordered by creation date', async ({ client, assert }) => {
    const firstProduct = await createProduct({ name: 'Alpha Widget', price: 9.99, stock: 3 })
    await delay(5)
    const secondProduct = await createProduct({ name: 'Beta Widget', price: 19.5, stock: 8 })

    const response = await client.get('/api/products').headers(AUTH_HEADERS)

    response.assertStatus(200)
    const { products } = response.body()
    assert.lengthOf(products, 2)
    assert.equal(products[0].name, secondProduct.name)
    assert.equal(products[1].name, firstProduct.name)
  })

  test('creates a product successfully', async ({ client, assert }) => {
    const payload = { name: 'New Product', price: 42.75, stock: 15 }

    const response = await client.post('/api/products').headers(AUTH_HEADERS).json(payload)

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Product created successfully.' })

    const createdProduct = response.body().product
    assert.equal(createdProduct.name, payload.name)
    assert.equal(Number(createdProduct.price), payload.price)
    assert.equal(createdProduct.stock, payload.stock)
  })

  test('shows a product by id', async ({ client }) => {
    const product = await createProduct({ name: 'Viewable Product', price: 15.25, stock: 4 })

    const response = await client.get(`/api/products/${product.id}`).headers(AUTH_HEADERS)

    response.assertStatus(200)
    response.assertBodyContains({ product: { id: product.id } })
  })

  test('rejects product lookup with invalid id', async ({ client }) => {
    const response = await client.get('/api/products/abc').headers(AUTH_HEADERS)

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Invalid product id.' })
  })

  test('returns not found when product does not exist', async ({ client }) => {
    const response = await client.get('/api/products/999').headers(AUTH_HEADERS)

    response.assertStatus(404)
    response.assertBodyContains({ message: 'Product not found.' })
  })

  test('updates an existing product', async ({ client, assert }) => {
    const product = await createProduct({ name: 'Editable Product', stock: 12 })

    const updateRequest = client.put(`/api/products/${product.id}`)
    updateRequest.headers(AUTH_HEADERS)
    const response = await updateRequest.json({ name: 'Updated Product', stock: 6 })

    response.assertStatus(200)
    const updatedProduct = response.body().product
    assert.equal(updatedProduct.name, 'Updated Product')
    assert.equal(updatedProduct.stock, 6)
  })

  test('rejects update when no fields are provided', async ({ client }) => {
    const product = await createProduct({ name: 'Locked Product' })

    const emptyUpdateRequest = client.put(`/api/products/${product.id}`)
    emptyUpdateRequest.headers(AUTH_HEADERS)
    const response = await emptyUpdateRequest.json({})

    response.assertStatus(400)
    response.assertBodyContains({ message: 'At least one field must be provided.' })
  })

  test('returns not found when updating missing product', async ({ client }) => {
    const missingUpdateRequest = client.put('/api/products/999')
    missingUpdateRequest.headers(AUTH_HEADERS)
    const response = await missingUpdateRequest.json({ name: 'Ghost' })

    response.assertStatus(404)
    response.assertBodyContains({ message: 'Product not found.' })
  })

  test('rejects update with invalid id', async ({ client }) => {
    const invalidUpdateRequest = client.put('/api/products/not-a-number')
    invalidUpdateRequest.headers(AUTH_HEADERS)
    const response = await invalidUpdateRequest.json({ name: 'Invalid' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Invalid product id.' })
  })

  test('deletes an existing product', async ({ client, assert }) => {
    const product = await createProduct({ name: 'Disposable Product' })

    const response = await client.delete(`/api/products/${product.id}`).headers(AUTH_HEADERS)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Product deleted successfully.' })

    const deletedProduct = await db
      .selectFrom('products')
      .select(['id'])
      .where('id', '=', product.id)
      .executeTakeFirst()

    assert.isUndefined(deletedProduct)
  })

  test('rejects deletion with invalid id', async ({ client }) => {
    const response = await client.delete('/api/products/invalid').headers(AUTH_HEADERS)

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Invalid product id.' })
  })

  test('returns not found when deleting missing product', async ({ client }) => {
    const response = await client.delete('/api/products/999').headers(AUTH_HEADERS)

    response.assertStatus(404)
    response.assertBodyContains({ message: 'Product not found.' })
  })
})

async function seedAuthUser() {
  const now = new Date()

  await db
    .insertInto('users')
    .values({
      id: randomUUID(),
      name: 'Functional Tester',
      email: 'tester@example.com',
      password: 'hashed-password',
      token: AUTH_TOKEN,
      createdAt: now,
      updatedAt: now,
    })
    .execute()
}

async function createProduct(overrides: ProductOverrides = {}) {
  const now = new Date()
  const name = overrides.name ?? `Product-${Math.random().toString(36).slice(2, 10)}`

  const product = await db
    .insertInto('products')
    .values({
      name,
      price: overrides.price ?? 25,
      stock: overrides.stock ?? 5,
      createdAt: now,
      updatedAt: now,
    })
    .returning(['id', 'name', 'price', 'stock', 'createdAt', 'updatedAt'] as const)
    .executeTakeFirst()

  if (!product) {
    throw new Error('Unable to create product fixture')
  }

  return product
}

async function delay(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds))
}
