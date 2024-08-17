import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge', // Ensure it runs as an Edge function
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const topicsParam = searchParams.get('topics');
    const topics = topicsParam ? JSON.parse(decodeURIComponent(topicsParam)) : [];
    const title = 'Trending Topics on Farcaster';
    const subtitle = topics.join(' | '); // Combine topics as a subtitle

    console.log('Generating image with topics:', topics);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: '3',
              padding: '0 20px',
            }}
          >
            <div style={{ fontSize: '50px', color: '#333', fontWeight: 'bold' }}>
              {title}
            </div>
            <div style={{ fontSize: '30px', color: '#777', marginTop: '10px' }}>
              {subtitle}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: '2',
            }}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/default-avatar.png`}
              alt="Trending"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '5px solid #ddd',
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630, // 1.91:1 aspect ratio
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
