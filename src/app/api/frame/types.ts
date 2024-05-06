import { Generated, ColumnType, Selectable, Insertable, Updateable } from 'kysely'
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

export type Player = Selectable<PlayersTable>
export type NewPlayer = Insertable<PlayersTable>
export type PlayerUpdate = Updateable<PlayersTable>

export const db = createKysely<Database>()
export { sql } from 'kysely'