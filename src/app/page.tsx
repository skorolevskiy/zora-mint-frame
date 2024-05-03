import {
  CHAIN,
  CONTRACT_ADDRESS,
  FRAME_METADATA,
  SITE_URL,
  TOKEN_ID,
} from '@/config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: 'Pill spin game [BETA]',
  aspectRatio: '1:1',
  other: FRAME_METADATA,
};

export default function Home() {
  return (
    <div style={{ minHeight: '92dvh', display: 'flex' }}>
      <h1
        style={{
          margin: 'auto',
          fontFamily: 'Comic Sans MS, Comic Sans, cursive',
          fontSize: '80px'
        }}
      >
        Go to Farcaster!
      </h1>
    </div>
  );
}
