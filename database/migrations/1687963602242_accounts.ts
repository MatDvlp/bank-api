import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import {Knex} from "knex";

export default class extends BaseSchema {
  protected tableName: string= 'accounts'

  public async up (): Promise<any> {
    this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
      table.string('id')
      table.string('titular')
      table.string('iban')
      table.string('bic')
      table.increments('money')
      table.string('password')
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
