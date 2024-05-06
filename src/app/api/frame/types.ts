import { Generated, ColumnType } from 'kysely'
import { createKysely } from '@vercel/postgres-kysely'

export interface PlayersTable {
  id: Generated<number>
  fid: string | null
  username: string | null
  name: string | null
  points: number
  createdAt: ColumnType<Date, string | undefined, never>
}

// Keys of this interface are table names.
export interface Database {
  spiners: PlayersTable
}

export const db = createKysely<Database>()
export { sql } from 'kysely'