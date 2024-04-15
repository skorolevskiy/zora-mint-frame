import { zora } from 'viem/chains';
import { getFrameMetadata } from '@coinbase/onchainkit';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const CHAIN = zora;
export const CONTRACT_ADDRESS = '0x774d76858551724ba815d82d90159017797560e7';
export const TOKEN_ID = 2n; // First collection is 1

export const FRAME_METADATA = getFrameMetadata({
  buttons: ['Free mint'],
  image: `${SITE_URL}/opengraph-image.png`,
  post_url: `${SITE_URL}/api/frame`,
});
