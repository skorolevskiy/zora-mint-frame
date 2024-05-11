import { Generated, ColumnType } from 'kysely'
import { createKysely } from '@vercel/postgres-kysely'

export interface PlayersTable {
	id: Generated<number>
	fid: string | null
	username: string | null
	name: string | null
	points: number
	dailySpins: number
	lastSpin: ColumnType<Date, string | undefined, never>
	createdAt: ColumnType<Date, string | undefined, never>
}

// Keys of this interface are table names.
export interface Database {
	spiners: PlayersTable
}

export const db = createKysely<Database>()
export { sql } from 'kysely'

export async function getUser(fid: string | null): Promise<any> {
	let data: any;

	try {
		data = await db
			.selectFrom('spiners')
			.where('fid', '=', fid)
			.selectAll().executeTakeFirst();
		return data; // Data fetched successfully
	} catch (e: any) {
		if (e.message.includes('relation "spiners" does not exist')) {
			console.warn(
				'Table does not exist, creating and seeding it with dummy data now...'
			);
			// Table is not created yet
			//await seed();
			return false; // Data fetched successfully after seeding
		} else {
			console.error('Error fetching data:', e);
			return false; // Error occurred while fetching data
		}
	}
}

export async function addUser(fid: string | null, username: string | null, display_name: string | null) {

	const result = await db
		.insertInto('spiners')
		.values({
			fid: fid ? fid : null,
			username: username ? username : null,
			name: display_name ? display_name : null,
			points: 0,
			dailySpins: 3,
			lastSpin: new Date().toISOString().split('T')[0]
		})
		.executeTakeFirst()
}

export async function updatePoints(fid: string | null, points: number, dailySpins: number) {
	await db
		.updateTable('spiners')
		.set((eb) => ({
			points: eb('points', '+', points),
			dailySpins: eb('dailySpins', '-', dailySpins)
		}))
		.where('fid', '=', fid)
		.execute()
}