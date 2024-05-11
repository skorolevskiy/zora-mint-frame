import {
  FRAME_METADATA,
  SITE_URL
} from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: 'Pill spin game [BETA]',
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
      <script async src="${SITE_URL}/public/js/pills.js"></script>
    </div>
  );
}
