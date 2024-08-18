import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const topics = searchParams.get('topics')?.split(',') || [];
  const profileImageUrl = searchParams.get('profileImageUrl');

  // Log the incoming topics and profileImageUrl
  console.log('Received topics:', topics);
  console.log('Received profileImageUrl:', profileImageUrl);

  // Check if the profileImageUrl is undefined or invalid
  const imageUrl = profileImageUrl && profileImageUrl.startsWith('http')
    ? profileImageUrl
    : 'https://example.com/default-avatar.png'; // Replace with your own default image URL

  if (topics.length === 0) {
    console.warn('No topics provided in request.');
    return new Response('No topics provided', { status: 400 });
  }

  try {
    // Additional logging before generating the image
    console.log('Generating image with the following data:');
    console.log('Image URL:', imageUrl);
    console.log('Topics:', topics);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
          }}
        >
          <img
            src={imageUrl}
            alt="Profile"
            style={{
              borderRadius: '50%',
              width: '100px',  // Explicitly define width
              height: '100px', // Explicitly define height
              marginBottom: 20,
            }}
          />
          <div
            style={{
              fontSize: 40,
              color: '#333',
              textAlign: 'center',
            }}
          >
            {topics.map((topic, index) => (
              <p key={index}>{topic}</p>
            ))}
          </div>
        </div>
      ),
      {
        width: 800,
        height: 600,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error.message);
    return new Response('Failed to generate image', { status: 500 });
  }
}
