import { CHAIN, CONTRACT_ADDRESS, SITE_URL, TOKEN_ID, NEYNAR_API_KEY } from '@/config';
//import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import {
	Address,
	Hex,
	TransactionExecutionError,
	http,
} from 'viem';

let fid: string, points: number, spins: number, dateString: string;
import { addUser, getUser, updateDate } from './types'
//const HAS_KV = !!process.env.KV_URL;
//const transport = http(process.env.RPC_URL);

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
	try {
		const body: { trustedData?: { messageBytes?: string } } = await req.json();

		// Check if frame request is valid
		const status = await validateFrameRequest(body.trustedData?.messageBytes);

		if (!status?.valid) {
			console.error(status);
			throw new Error('Invalid frame request');
		}

		const fid_new = status?.action?.interactor?.fid ? JSON.stringify(status.action.interactor.fid) : null;
		const username_new = status?.action?.interactor?.username ? JSON.stringify(status.action.interactor.username) : null;
		const display_name_new = status?.action?.interactor?.display_name ? JSON.stringify(status.action.interactor.display_name) : null;

		const User = await getUser(fid_new);

		if (!User) {
			console.warn('not added: ' + JSON.stringify(User));
			await addUser(fid_new, username_new, display_name_new);
			points = 0;
			spins = 3;
		} else {
			console.warn('added: ' + JSON.stringify(User));

			//let data = JSON.parse(User);
			points = User.points;
			spins = User.dailySpins;
			dateString = User.lastSpin;
		}

		const today: string = new Date().toLocaleString().split(',')[0];
		const lastSpin: string = new Date(dateString).toLocaleString().split(',')[0];

		if (lastSpin !== today) {
			await updateDate(fid_new, today);
			spins = 3;
		}

		// // Check if user has liked and recasted
		const hasLikedAndRecasted =
			!!status?.action?.cast?.viewer_context?.liked &&
			!!status?.action?.cast?.viewer_context?.recasted;

		if (!hasLikedAndRecasted) {
			return getResponse(ResponseType.RECAST);
		}

		// Check if user has an address connected
		const address: Address | undefined =
			status?.action?.interactor?.verifications?.[0];

		if (!address) {
			return getResponse(ResponseType.NO_ADDRESS);
		}

		return getResponse(ResponseType.SUCCESS);
	} catch (error) {
		console.error(error);
		return getResponse(ResponseType.ERROR);
	}
}

enum ResponseType {
	SUCCESS,
	RECAST,
	ALREADY_MINTED,
	NO_ADDRESS,
	OUT_OF_GAS,
	ERROR,
}

function getResponse(type: ResponseType) {
	const IMAGE = {
		[ResponseType.SUCCESS]: 'status/success.webp',
		[ResponseType.RECAST]: 'status/recast.png',
		[ResponseType.ALREADY_MINTED]: 'status/already-minted.png',
		[ResponseType.NO_ADDRESS]: 'status/no-address.png',
		[ResponseType.OUT_OF_GAS]: 'status/out-of-gas.png',
		[ResponseType.ERROR]: 'status/error.png',
	}[type];
	const shouldRetry =
		type === ResponseType.ERROR || type === ResponseType.RECAST;
	// const successRetry = 
	//   type === ResponseType.SUCCESS;
	return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${SITE_URL}/${IMAGE}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:post_url" content="${SITE_URL}/api/frame" />

    ${shouldRetry
			? `<meta property="fc:frame:button:1" content="Try again" />`
			: `<meta name="fc:frame:button:1" content="${spins} Free spins" />
        <meta name="fc:frame:button:1:action" content="post" />
        <meta name="fc:frame:button:1:target" content="${SITE_URL}/api/frame/spin/" />
    
        <meta name="fc:frame:button:2" content="📖Rules" />
        <meta name="fc:frame:button:2:action" content="post" />
        <meta name="fc:frame:button:2:target" content="${SITE_URL}/api/frame/rules/" />
    
        <meta name="fc:frame:button:3" content="Leaderboard" />
        <meta name="fc:frame:button:3:action" content="post" />
        <meta name="fc:frame:button:3:target" content="${SITE_URL}/api/frame/leaderboard/" />
    
        <meta name="fc:frame:button:4" content="Buy PILL" />
        <meta name="fc:frame:button:4:action" content="link" />
        <meta name="fc:frame:button:4:target" content="https://app.uniswap.org/swap?chain=base&inputCurrency=ETH&outputCurrency=0x388e543a5a491e7b42e3fbcd127dd6812ea02d0d" />`
		}

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
		body: JSON.stringify({
			cast_reaction_context: true,
			follow_context: true,
			signer_context: false,
			channel_follow_context: true,
			message_bytes_in_hex: data
		}),
	};

	return await fetch(
		'https://api.neynar.com/v2/farcaster/frame/validate',
		options,
	)
		.then((response) => response.json())
		.catch((err) => console.error(err));
}
