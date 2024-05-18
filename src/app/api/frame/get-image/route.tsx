import { ImageResponse } from 'next/og';
import { getTopPlayers, getUser, getUserPosition } from '../types';
// App router includes @vercel/og.
// No need to install it.

let fid: string, username: string, points: number, position: number;

interface Player {
	fid: string;
	username: string,
	points: number;
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		const hasFid = searchParams.has('fid');
		const fid = hasFid ? searchParams.get('fid') : null;

		const user = await getUser(fid);
		// position = await getUserPosition(fid);

		// console.log(position);

		if (!user) {
			points = 0;
		} else {
			username = (user.username).replace(/"/g, '');
			points = user.points;
		}

		const topPlayers: Player[] = await getTopPlayers();

		return new ImageResponse(
			(
				<div
					style={{
						fontSize: 40,
						color: 'black',
						background: '#0052FF',
						width: '100%',
						height: '100%',
						padding: '50px',
						textAlign: 'center',
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						flexDirection: 'column',
						flexWrap: 'nowrap',
					}}
				>
					<div
						style={{
							fontFamily: 'Inter, "Material Icons"',
							fontSize: 40,
							fontStyle: 'normal',
							fontWeight: 700,
							letterSpacing: '-0.025em',
							color: 'white',
							lineHeight: 1.4,
							whiteSpace: 'pre-wrap',
						}}
					>
						Leaderboard
					</div>

					<div tw="flex w-full text-3xl">
						<div tw="flex bg-white shadow-lg rounded-lg my-6">
							<table tw="w-full flex flex-col rounded-lg">
								<thead tw="flex">
									<tr tw="flex w-full bg-gray-200 text-gray-600 uppercase text-2xl leading-normal rounded-lg">
										<th tw="py-3 px-6 text-left">#</th>
										<th tw="w-1/4 py-3 px-6 text-left">Fid</th>
										<th tw="w-1/2 py-3 px-6 text-left">Nickname</th>
										<th tw="flex-1 py-3 px-6 text-black text-center">Points</th>
									</tr>
								</thead>
								<tbody tw="flex w-full flex-col text-gray-600 text-2xl font-light">
									{topPlayers.map((player, index) => (
										<tr  key={index + 1} tw="flex w-full border-b border-gray-200 bg-gray-50">
											<td tw="py-3 px-6 text-left">
												<span tw="font-medium">{index + 1}</span>
											</td>
											<td tw="w-1/4 py-3 px-6 text-left">
												<span tw="font-medium">{player.fid}</span>
											</td>
											<td tw="w-1/2 py-3 px-6 text-left">
												<span>@{(player.username).replace(/"/g, '')}</span>
											</td>
											<td tw="flex-1 py-3 px-6 text-black">
												<span>{player.points}</span>
											</td>
										</tr>
									))}

									<tr tw="flex w-full border-2 border-red-600 rounded-lg">
										<td tw="py-3 px-6 text-left">
											<div tw="flex items-center">
												<span tw="font-medium">{position}</span>
											</div>
										</td>
										<td tw="w-1/4 py-3 px-6 text-left">
											<div tw="flex items-center">
												<span tw="font-medium">{fid}</span>
											</div>
										</td>
										<td tw="w-1/2 py-3 px-6 text-left">
											<div tw="flex items-center">
												<span>@{username}</span>
											</div>
										</td>
										<td tw="flex-1 py-3 px-6 text-black">
											<span>{points}</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			),
			{
				width: 960,
				height: 960,
			},
		);
	} catch (e: any) {
		console.log(`${e.message}`);
		return new Response(`Failed to generate the image`, {
			status: 500,
		});
	}
}