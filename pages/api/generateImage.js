import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url);
    const topicsParam = searchParams.get('topics');
    const topics = topicsParam ? JSON.parse(decodeURIComponent(topicsParam)) : [];

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
            padding: '40px',
            backgroundColor: '#f9f9f9',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#333' }}>
            Trending Topics
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '30px', color: '#777' }}>
            {topics.map((topic, index) => (
              <div key={index} style={{ margin: '10px 0' }}>
                {topic}
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
}