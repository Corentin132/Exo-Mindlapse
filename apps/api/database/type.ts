import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface UsersTable {
  id: string
  name: string
  email: string
  password: string
  token: string | null
  createdAt: ColumnType<Date, Date | string | undefined, Date>
  updatedAt: ColumnType<Date, Date | string | undefined, Date>
}

export type UserRow = Selectable<UsersTable>
export type NewUserRow = Insertable<UsersTable>
export type UserUpdateRow = Updateable<UsersTable>

export interface ProductsTable {
  id: ColumnType<number, number | undefined, number>
  name: string
  price: number
  stock: number
  createdAt: ColumnType<Date, Date | string | undefined, Date>
  updatedAt: ColumnType<Date | null, Date | string | undefined, Date | null>
}

export type ProductRow = Selectable<ProductsTable>
export type NewProductRow = Insertable<ProductsTable>
export type ProductUpdateRow = Updateable<ProductsTable>

export interface Database {
  users: UsersTable
  products: ProductsTable
}
