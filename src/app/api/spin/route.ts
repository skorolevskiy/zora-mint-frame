import { CHAIN, CONTRACT_ADDRESS, SITE_URL, TOKEN_ID, NEYNAR_API_KEY } from '@/config';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import {
  Address,
  Hex,
  TransactionExecutionError,
  http,
} from 'viem';

// const HAS_KV = !!process.env.KV_URL;

// const transport = http(process.env.RPC_URL);

// const publicClient = createPublicClient({
//   chain: CHAIN,
//   transport,
// });

// const walletClient = createWalletClient({
//   chain: CHAIN,
//   transport,
// });

//export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    //if (!MINTER_PRIVATE_KEY) throw new Error('MINTER_PRIVATE_KEY is not set');

    const body: { trustedData?: { messageBytes?: string } } = await req.json();

    // Check if frame request is valid
    const status = await validateFrameRequest(body.trustedData?.messageBytes);

    if (!status?.valid) {
      console.error(status);
      throw new Error('Invalid frame request');
    }

    // // Check if user has liked and recasted
    // const hasLikedAndRecasted =
    //   !!status?.action?.cast?.viewer_context?.liked &&
    //   !!status?.action?.cast?.viewer_context?.recasted;

    // if (!hasLikedAndRecasted) {
    //   return getResponse(ResponseType.RECAST);
    // }

    // Check if user has an address connected
    const address: Address | undefined =
      status?.action?.interactor?.verifications?.[0];

    if (!address) {
      return getResponse(ResponseType.NO_ADDRESS);
    }

    function weighted_random_number() {
      const weights = [1, 2, 1, 3, 1, 3, 2, 3];
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

  
  // Пример использования функции:
  const randomNumber = weighted_random_number();

  switch (randomNumber) {
    case 1:
      return getResponse(ResponseType.IMAGE_1);
    case 2:
      return getResponse(ResponseType.IMAGE_2);
    case 3:
      return getResponse(ResponseType.IMAGE_3);
    case 4:
      return getResponse(ResponseType.IMAGE_4);
    case 5:
      return getResponse(ResponseType.IMAGE_5);
    case 6:
      return getResponse(ResponseType.IMAGE_6);
    case 7:
      return getResponse(ResponseType.IMAGE_7);
    case 8:
      return getResponse(ResponseType.IMAGE_8);
}
  
  return getResponse(ResponseType.IMAGE_8);
    // Check if user has minted before
    // if (HAS_KV) {
    //   const prevMintHash = await kv.get<Hex>(`mint:${address}`);

    //   if (prevMintHash) {
    //     return getResponse(ResponseType.ALREADY_MINTED);
    //   }
    // }

    // // Check if user has a balance
    // const balance = await publicClient.readContract({
    //   abi: Zora1155ABI,
    //   address: CONTRACT_ADDRESS,
    //   functionName: 'balanceOf',
    //   args: [address, TOKEN_ID],
    // });

    // if (balance > 5n) {
    //   return getResponse(ResponseType.ALREADY_MINTED);
    // }

    // Try minting a new token
    // const { request } = await publicClient.simulateContract({
    //   address: CONTRACT_ADDRESS,
    //   abi: Zora1155ABI,
    //   functionName: 'adminMint',
    //   args: [address, TOKEN_ID, 1n, '0x'],
    //   account: privateKeyToAccount(MINTER_PRIVATE_KEY),
    // });

    // if (!request) {
    //   throw new Error('Could not simulate contract');
    // }

    // try {
    //   const hash = await walletClient.writeContract(request);

    //   if (HAS_KV) {
    //     await kv.set(`mint:${address}`, hash);
    //   }
    // } catch (error) {
    //   if (
    //     error instanceof TransactionExecutionError &&
    //     error.details.startsWith('gas required exceeds allowance')
    //   ) {
    //     return getResponse(ResponseType.OUT_OF_GAS);
    //   }
    // }

  } catch (error) {
    console.error(error);
    return getResponse(ResponseType.ERROR);
  }
}

enum ResponseType {
  SUCCESS,
  IMAGE_1,
  IMAGE_2,
  IMAGE_3,
  IMAGE_4,
  IMAGE_5,
  IMAGE_6,
  IMAGE_7,
  IMAGE_8,
  ALREADY_MINTED,
  NO_ADDRESS,
  ERROR,
}

function getResponse(type: ResponseType) {
  const IMAGE = {
    [ResponseType.SUCCESS]: 'status/success.webp',
    [ResponseType.IMAGE_1]: 'status/image-1.webp',
    [ResponseType.IMAGE_2]: 'status/image-2.webp',
    [ResponseType.IMAGE_3]: 'status/image-3.webp',
    [ResponseType.IMAGE_4]: 'status/image-4.webp',
    [ResponseType.IMAGE_5]: 'status/image-5.webp',
    [ResponseType.IMAGE_6]: 'status/image-6.webp',
    [ResponseType.IMAGE_7]: 'status/image-7.webp',
    [ResponseType.IMAGE_8]: 'status/image-8.webp',
    [ResponseType.ALREADY_MINTED]: 'status/already-minted.png',
    [ResponseType.NO_ADDRESS]: 'status/no-address.png',
    [ResponseType.ERROR]: 'status/error.png',
  }[type];
  // const shouldRetry =
  //   type === ResponseType.ERROR || type === ResponseType.RECAST;
  // const successRetry = 
  //   type === ResponseType.SUCCESS;
  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${SITE_URL}/${IMAGE}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:post_url" content="${SITE_URL}/api/frame" />

    <meta name="fc:frame:button:1" content="🔄Spin again" />
    <meta name="fc:frame:button:1:action" content="post" />
    <meta name="fc:frame:button:1:target" content="${SITE_URL}/api/frame/spin/" />

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