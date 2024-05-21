//import { base } from 'viem/chains';
import { getFrameMetadata, FrameImageMetadata } from '@coinbase/onchainkit/frame';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

// export const CHAIN = base;
// export const CONTRACT_ADDRESS = '0x010d89d73ac069f9b828aee44eeaacdded3e7c9a';
// export const TOKEN_ID = 3n; // First collection is 1

export const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

const imageData: FrameImageMetadata = {
	src: `${SITE_URL}/opengraph-image.png`,
	aspectRatio: '1:1' // или '1.91:1'
};

export const FRAME_METADATA = getFrameMetadata({
	buttons: [{
		label: 'Enter Game',
	},],
	image: imageData,
	post_url: `${SITE_URL}/api/frame`,
});
