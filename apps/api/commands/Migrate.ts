import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Kysely/Database'
import { up } from '../database/migrations/0001_create_schema'

export default class Migrate extends BaseCommand {
  public static commandName = 'migrate'
  public static description = 'Run database migrations'
  public static settings = {
    loadApp: true,
  }

  public async run() {
    await up(Database)
    this.logger.success('Migrations applied successfully.')
  }
}
