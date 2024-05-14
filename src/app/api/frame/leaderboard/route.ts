import { CHAIN, CONTRACT_ADDRESS, SITE_URL, TOKEN_ID, NEYNAR_API_KEY } from '@/config';
import { NextRequest, NextResponse } from 'next/server';
import { getUser, getTopPlayers } from './../types';

export const dynamic = 'force-dynamic';
let points: number, fid: string | null;

// import { ImageResponse } from '@vercel/og';
// export const config = {
// 	runtime: 'edge',
// };

export async function POST(req: NextRequest): Promise<Response> {
	try {
		const body: { trustedData?: { messageBytes?: string } } = await req.json();

		// Check if frame request is valid
		const status = await validateFrameRequest(body.trustedData?.messageBytes);

		if (!status?.valid) {
			console.error(status);
			throw new Error('Invalid frame request');
		}

		fid = status?.action?.interactor?.fid ? JSON.stringify(status.action.interactor.fid) : null;

		// const User = await getUser(fid_new);

		// if (!User) {
		// 	points = 0;
		// } else {
		// 	points = User.points;
		// }

		const topPlayers = await getTopPlayers();

		if (!topPlayers) {
			console.warn('no top users')
		} else {
			console.warn(topPlayers)
		}

		// const image = await handler();

		// if (!image) {
		// 	console.warn('no top users')
		// } else {
		// 	console.warn(image)
		// }

		return getResponse(ResponseType.SUCCESS);
	} catch (error) {
		console.error(error);
		return getResponse(ResponseType.ERROR);
	}
}

enum ResponseType {
	SUCCESS,
	NO_ADDRESS,
	ERROR,
}

function getResponse(type: ResponseType) {
	const IMAGE = {
		[ResponseType.SUCCESS]: 'status/success.png',
		[ResponseType.NO_ADDRESS]: 'status/no-address.png',
		[ResponseType.ERROR]: 'status/error.png',
	}[type];
	// const shouldRetry =
	//   type === ResponseType.ERROR || type === ResponseType.RECAST;
	// const successRetry = 
	//   type === ResponseType.SUCCESS;
	return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${SITE_URL}/api/frame/get-image?fid${fid}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:post_url" content="${SITE_URL}/api/frame" />

	<meta name="fc:frame:button:1" content="🔄${points} points" />
    <meta name="fc:frame:button:1:action" content="post" />
    <meta name="fc:frame:button:1:target" content="${SITE_URL}/api/frame/leaderboard/" />

    <meta name="fc:frame:button:2" content="↩️Back" />
    <meta name="fc:frame:button:2:action" content="post" />
    <meta name="fc:frame:button:2:target" content="${SITE_URL}/api/frame/" />

  </head></html>`);
}

async function validateFrameRequest(data: string | undefined) {
	if (!NEYNAR_API_KEY) throw new Error('NEYNAR_API_KEY is not set');
	if (!data) throw new Error('No data provided');

	const options = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			api_key: NEYNAR_API_KEY,
			'content-type': 'application/json',
		},
		body: JSON.stringify({ message_bytes_in_hex: data }),
	};

	return await fetch(
		'https://api.neynar.com/v2/farcaster/frame/validate',
		options,
	)
		.then((response) => response.json())
		.catch((err) => console.error(err));
}
