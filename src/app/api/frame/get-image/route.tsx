import { ImageResponse } from 'next/og';
import { getUser } from '../types';
// App router includes @vercel/og.
// No need to install it.

let fid: string, username: string, points: number;

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		const hasFid = searchParams.has('fid');
		const fid = hasFid ? searchParams.get('fid') : null;

		const user = await getUser(fid);

		if (!user) {
			points = 0;
		} else {
			username = user.username;
			points = user.points;
		}

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
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						flexWrap: 'nowrap',
					}}
				>
					<div
						style={{
							fontFamily: 'Inter, "Material Icons"',
							fontSize: 60,
							fontStyle: 'normal',
							fontWeight: '700',
							letterSpacing: '-0.025em',
							color: 'white',
							marginTop: 30,
							lineHeight: 1.4,
							whiteSpace: 'pre-wrap',
						}}
					>
						Leaderboard
					</div>
					<div tw="w-full">
						<div tw="bg-white shadow-md rounded my-6">
							<table tw="w-full">
								<thead>
									<tr tw="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
										<th tw="py-3 px-6 text-left">#</th>
										<th tw="py-3 px-6 text-left">Nickname</th>
										<th tw="py-3 px-6 text-center">Points</th>
									</tr>
								</thead>
								<tbody tw="text-gray-600 text-sm font-light">
									<tr tw="border-b border-gray-200">
										<td tw="py-3 px-6 text-left">
											<div tw="flex items-center">
												<span tw="font-medium">1</span>
											</div>
										</td>
										<td tw="py-3 px-6 text-left">
											<div tw="flex items-center">
												<span>{username}</span>
											</div>
										</td>
										<td tw="py-3 px-6 text-center">
											<span>{points}</span>
										</td>
									</tr>
									<tr tw="border-b border-gray-200 bg-gray-50">
										<td tw="py-3 px-6 text-left">
											<div tw="flex items-center">
												<span tw="font-medium">2</span>
											</div>
										</td>
										<td tw="py-3 px-6 text-left">
											<div tw="flex items-center">
												<span>Test</span>
											</div>
										</td>
										<td tw="py-3 px-6 text-center">
											<span>1400</span>
										</td>
									</tr>
									<tr tw="border-b border-gray-200">
										<td tw="py-3 px-6 text-left">
											<div tw="flex items-center">
												<span tw="font-medium">3</span>
											</div>
										</td>
										<td tw="py-3 px-6 text-left">
											<div tw="flex items-center">
												<span>Test2</span>
											</div>
										</td>
										<td tw="py-3 px-6 text-center">
											<span>1300</span>
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