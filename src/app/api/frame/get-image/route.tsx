import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
 
    // ?title=<title>
    const hasFid = searchParams.has('fid');
    const fid = hasFid
      ? searchParams.get('fid')?.slice(0, 100)
      : 'My default title';
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'white',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            Leaderboard
          </div>
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'white',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            {fid}
          </div>
        </div>
      ),
      {
        width: 960,
        height: 960,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}