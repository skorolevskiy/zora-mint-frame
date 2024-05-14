import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          fontWeight: 'bold',
          color: 'white',
          background: '#0052FF',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        Leaderboard
      </div>
    ),
    {
      width: 960,
      height: 960,
    },
  );
}