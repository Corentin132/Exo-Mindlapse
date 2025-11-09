import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Kysely/Database'
import { up as migrateUp } from '../database/migrations/0000_create_schema'

export default class Seed extends BaseCommand {
  public static commandName = 'seed'
  public static description = 'Seed baseline data for development runs'
  public static settings = {
    loadApp: true,
  }

  public async run() {
    await migrateUp(Database)

    const existingProduct = await Database.selectFrom('products')
      .select('id')
      .limit(1)
      .executeTakeFirst()

    if (existingProduct) {
      this.logger.info('Products table already contains data. Skipping seed.')
      return
    }

    const products = [
      { name: 'Workstation Pro', price: 2499.99, stock: 5 },
    ]
    // 100 random products for seeding
    const product = { name: 'Generic Product', price: 19.99, stock: 100 }
    for (let i = 0; i < 100; i++) {
      products.push({ ...product, name: `Generic Product ${i + 1}`, price : (Math.random() * 100).toFixed(2) as unknown as number, stock: Math.floor(Math.random() * 200) })
    }

    const now = new Date()

    await Database.insertInto('products')
      .values(
        products.map((product) => ({
          ...product,
          created_at: new Date(now.getTime()),
        }))
      )
      .execute()

    this.logger.success(`Seeded ${products.length} products for development.`)
  }

}
