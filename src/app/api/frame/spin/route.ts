import { CHAIN, CONTRACT_ADDRESS, SITE_URL, TOKEN_ID, NEYNAR_API_KEY } from '@/config';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import {
	Address,
	Hex,
	TransactionExecutionError,
	http,
} from 'viem';
import { updatePointsSpins, updatePoints, updateDate, getUser } from '../types';

// const HAS_KV = !!process.env.KV_URL;
// const transport = http(process.env.RPC_URL);

export const dynamic = 'force-dynamic';
let spins: number, date: string, points: number;

export async function POST(req: NextRequest): Promise<Response> {
	try {
		const body: { trustedData?: { messageBytes?: string } } = await req.json();

		// Check if frame request is valid
		const status = await validateFrameRequest(body.trustedData?.messageBytes);

		if (!status?.valid) {
			console.error(status);
			throw new Error('Invalid frame request');
		}

		const fid = status?.action?.interactor?.fid ? JSON.stringify(status.action.interactor.fid) : null;

		const User = await getUser(fid);

		if (!User) {
			spins = 0;
		} else {
			spins = User.dailySpins;
			points = User.points;
		}

		const randomNumber = weighted_random_number();

		if (spins > 0) {
			switch (randomNumber) {
				case 1:
					await updatePointsSpins(fid, 5);
					spins--;
					return getResponse(ResponseType.IMAGE_5);
				case 2:
					await updatePointsSpins(fid, 25);
					spins--;
					return getResponse(ResponseType.IMAGE_25);
				case 3:
					await updatePointsSpins(fid, 50);
					spins--;
					return getResponse(ResponseType.IMAGE_50);
				case 4:
					await updatePointsSpins(fid, 100);
					spins--;
					return getResponse(ResponseType.IMAGE_100);
				case 5:
					await updatePointsSpins(fid, 150);
					spins--;
					return getResponse(ResponseType.IMAGE_150);
				case 6:
					await updatePointsSpins(fid, 200);
					spins--;
					return getResponse(ResponseType.IMAGE_200);
				case 7:
					await updatePointsSpins(fid, 250);
					spins--;
					return getResponse(ResponseType.IMAGE_250);
				case 8:
					await updatePointsSpins(fid, 500);
					spins--;
					return getResponse(ResponseType.IMAGE_500);
			}
		} else {
			if (points > 100) {
				switch (randomNumber) {
					case 1:
						await updatePoints(fid, -95);
						return getResponse(ResponseType.IMAGE_5);
					case 2:
						await updatePoints(fid, -75);
						return getResponse(ResponseType.IMAGE_25);
					case 3:
						await updatePoints(fid, -50);
						return getResponse(ResponseType.IMAGE_50);
					case 4:
						await updatePoints(fid, 0);
						return getResponse(ResponseType.IMAGE_100);
					case 5:
						await updatePoints(fid, 50);
						return getResponse(ResponseType.IMAGE_150);
					case 6:
						await updatePoints(fid, 100);
						return getResponse(ResponseType.IMAGE_200);
					case 7:
						await updatePoints(fid, 150);
						return getResponse(ResponseType.IMAGE_250);
					case 8:
						await updatePoints(fid, 400);
						return getResponse(ResponseType.IMAGE_500);
				}
			} else {
				return getResponse(ResponseType.SPIN_OUT);
			}
			
		}

		return getResponse(ResponseType.SPIN_OUT);
		// Check if user has minted before
		// if (HAS_KV) {
		//   const prevMintHash = await kv.get<Hex>(`mint:${address}`);

		//   if (prevMintHash) {
		//     return getResponse(ResponseType.ALREADY_MINTED);
		//   }
		// }

	} catch (error) {
		console.error(error);
		return getResponse(ResponseType.ERROR);
	}
}

enum ResponseType {
	SUCCESS,
	IMAGE_5,
	IMAGE_25,
	IMAGE_50,
	IMAGE_100,
	IMAGE_150,
	IMAGE_200,
	IMAGE_250,
	IMAGE_500,
	ALREADY_MINTED,
	NO_ADDRESS,
	ERROR,
	SPIN_OUT
}

function getResponse(type: ResponseType) {
	const IMAGE = {
		[ResponseType.SUCCESS]: 'status/success.webp',
		[ResponseType.IMAGE_5]: 'status/5.gif',
		[ResponseType.IMAGE_25]: 'status/25.gif',
		[ResponseType.IMAGE_50]: 'status/50.gif',
		[ResponseType.IMAGE_100]: 'status/100.gif',
		[ResponseType.IMAGE_150]: 'status/150.gif',
		[ResponseType.IMAGE_200]: 'status/200.gif',
		[ResponseType.IMAGE_250]: 'status/250.gif',
		[ResponseType.IMAGE_500]: 'status/500.gif',
		[ResponseType.ALREADY_MINTED]: 'status/already-minted.png',
		[ResponseType.NO_ADDRESS]: 'status/no-address.png',
		[ResponseType.ERROR]: 'status/error.png',
		[ResponseType.SPIN_OUT]: 'status/spin-out.png'
	}[type];
	const shouldRetry =
	  type === ResponseType.ERROR;
	// const successRetry = 
	//   type === ResponseType.SUCCESS;
	return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${SITE_URL}/${IMAGE}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:post_url" content="${SITE_URL}/api/frame" />

	${shouldRetry
		? `
		<meta name="fc:frame:button:1" content="🔁Referral" />
    	<meta name="fc:frame:button:1:action" content="link" />
    	<meta name="fc:frame:button:1:target" content="https://warpcast.com/~/compose?text=Spin%20for%20thrills%20%26%20wins%21%20Join%20Team%20Pill%27s%20Wheel%20of%20Fortune%20now%21&embeds[]=https://zora-mint-frame-three.vercel.app/" />

		<meta name="fc:frame:button:2" content="↩️Back" />
		<meta name="fc:frame:button:2:action" content="post" />
		<meta name="fc:frame:button:2:target" content="${SITE_URL}/api/frame/" />
		`
		: 
		`
    	<meta name="fc:frame:button:1" content="🔄${spins} Free spins" />
		<meta name="fc:frame:button:1:action" content="post" />
		<meta name="fc:frame:button:1:target" content="${SITE_URL}/api/frame/spin/" />

		<meta name="fc:frame:button:2" content="↩️Back" />
		<meta name="fc:frame:button:2:action" content="post" />
		<meta name="fc:frame:button:2:target" content="${SITE_URL}/api/frame/" />
		`
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
		body: JSON.stringify({ message_bytes_in_hex: data }),
	};

	return await fetch(
		'https://api.neynar.com/v2/farcaster/frame/validate',
		options,
	)
		.then((response) => response.json())
		.catch((err) => console.error(err));
}

function weighted_random_number() {
	const weights = [4, 4, 2, 2, 3, 5, 4, 4];

	const total_weight = weights.reduce((acc, val) => acc + val, 0);
	const random_weight = Math.floor(Math.random() * total_weight);
	let cumulative_weight = 0;
	for (let i = 0; i < weights.length; i++) {
		cumulative_weight += weights[i];
		if (random_weight < cumulative_weight) {
			return i + 1;
		}
	}
}