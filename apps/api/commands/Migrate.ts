import { BaseCommand } from '@adonisjs/core/ace'
import { db } from '../start/kysely.js'
import { up } from '../database/migrations/0000_create_schema.js'

export default class Migrate extends BaseCommand {
  public static commandName = 'migrate'
  public static description = 'Run database migrations'
  public static settings = {
    loadApp: true,
  }

  public async run() {
    await up(db)
    this.logger.success('Migrations applied successfully.')
  }
}
