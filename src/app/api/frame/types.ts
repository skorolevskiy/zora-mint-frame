import { Generated, ColumnType } from 'kysely'
import { createKysely } from '@vercel/postgres-kysely'

interface UserTable {
  id: Generated<number>
  name: string
  email: string
  image: string
  createdAt: ColumnType<Date, string | undefined, never>
}

// Keys of this interface are table names.
export interface Database {
  users: UserTable
}

export const db = createKysely<Database>()
export { sql } from 'kysely'