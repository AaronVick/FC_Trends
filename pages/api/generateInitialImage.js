import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          backgroundColor: '#f9f9f9',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '50px', fontWeight: 'bold', color: '#333' }}>
            Trending Topics on Farcaster
          </div>
          <div style={{ fontSize: '30px', marginTop: '20px', color: '#777' }}>
            Stay updated with the latest discussions.
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}