import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    console.log('Generating initial image for Trending Topics');

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div style={{ fontSize: '50px', fontWeight: 'bold', color: '#333' }}>
            Trending Topics on Farcaster
          </div>
          <div style={{ fontSize: '30px', marginTop: '20px', color: '#777', textAlign: 'center' }}>
            Stay updated with the latest discussions.
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630, // 1.91:1 aspect ratio
      }
    );

  } catch (error) {
    console.error('Error generating initial image:', error);
    return new Response('Error generating initial image', { status: 500 });
  }
}
