import { ImageResponse } from 'next/og';
import { getUser } from '../types';
// App router includes @vercel/og.
// No need to install it.

let fid: string, points: number;
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
 
    const hasFid = searchParams.has('fid');
    const fid = hasFid ? searchParams.get('fid') : null;

    const user = await getUser(fid);

    if (!user) {
			points = 0;
		} else {
			points = user.points;
		}

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: 'black',
            background: '#0052FF',
            width: '100%',
            height: '100%',
            padding: '50px',
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
              fontWeight: 'bold',
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
            {fid} = {points} points
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