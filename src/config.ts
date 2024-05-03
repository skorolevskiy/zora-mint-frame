import { base } from 'viem/chains';
import { getFrameMetadata } from '@coinbase/onchainkit';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const CHAIN = base;
export const CONTRACT_ADDRESS = '0x010d89d73ac069f9b828aee44eeaacdded3e7c9a';
export const TOKEN_ID = 3n; // First collection is 1

export const FRAME_METADATA = getFrameMetadata({
  buttons: ['Enter game'],
  image: `${SITE_URL}/opengraph-image.jpg`,
  aspectRatio: '1:1',
  post_url: `${SITE_URL}/api/frame`,
});
