import { ColumnType, Generated } from 'kysely'

export interface UserTable {
  id: Generated<number>
  email: string
  password: string
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface ProductTable {
  id: Generated<number>
  name: string
  price: number
  stock: number
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface Database {
  users: UserTable
  products: ProductTable
}
