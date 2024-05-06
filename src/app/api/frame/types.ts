import {
    ColumnType,
    Generated,
} from 'kysely'
import { createKysely } from '@vercel/postgres-kysely'

export interface Database {
    person: PersonTable
}

export interface PersonTable {
    id: Generated<number>

    fid: number
    username: string
    display: string | null

    created_at: ColumnType<Date, string | undefined, never>
}

export const db = createKysely<Database>()
export { sql } from 'kysely'