import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { Database } from 'database/schema'
import Env from '@ioc:Adonis/Core/Env'

export default class KyselyProvider {
  constructor(protected app: ApplicationContract) {}
  

  public register() {
    this.app.container.singleton('Kysely/Database', () => {
      const pool = new Pool({
        host: Env.get('DB_HOST', 'localhost'),
        port: Number(Env.get('DB_PORT', 5432)),
        user: Env.get('DB_USER', 'postgres'),
        password: Env.get('DB_PASSWORD', 'postgres'),
        database: Env.get('DB_DATABASE', 'appdb'),
      })

      const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
      })

      return db
    })
  }

  public async shutdown() {
    const db = this.app.container.hasBinding('Kysely/Database')
      ? (this.app.container.use('Kysely/Database') as Kysely<Database>)
      : null

    await db?.destroy?.()
  }
}
