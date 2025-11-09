import { Kysely } from 'kysely'
import { Database } from 'database/schema'

declare module '@ioc:Kysely/Database' {
  const db: Kysely<Database>
  //@ts-ignore
  export default db
}

declare module '@ioc:Adonis/Core/Application' {
  export interface ContainerBindings {
    'Kysely/Database': Kysely<Database>
  }
}

export {}
