import { SITE_URL } from '@/config';
import { ImageResponse } from 'next/og';
import { Parser } from 'json2csv';
import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, getTopPlayers, getUser, getUserPosition } from '../types';
// App router includes @vercel/og.
// No need to install it.




export async function POST(req: NextRequest): Promise<Response> {
    let data: any = await getAllUsers();
	return NextResponse.json(data);
}