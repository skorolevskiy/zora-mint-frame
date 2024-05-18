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
        <div style={{ minHeight: '92dvh', display: 'flex', background: '#0052FF', }}>
            <h1
                style={{
                    margin: 'auto',
                    fontFamily: 'Inter, "Material Icons, sans-serif',
                    fontSize: '80px',
                    textAlign: 'center',
                    color: 'white',
                }}
            >
                Go to Farcaster!
            </h1>
        </div>
    );
}
