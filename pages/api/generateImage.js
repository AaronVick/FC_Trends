import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const topics = searchParams.get('topics')?.split(',') || [];
  const profileImageUrl = searchParams.get('profileImageUrl');

  // Logging the incoming topics and profileImageUrl
  console.log('Received topics:', topics);
  console.log('Received profileImageUrl:', profileImageUrl);

  // Check if the profileImageUrl is undefined or invalid
  const imageUrl = profileImageUrl && profileImageUrl.startsWith('http')
    ? profileImageUrl
    : 'https://example.com/default-avatar.png'; // Replace with your default image URL

  if (topics.length === 0) {
    console.warn('No topics provided in the request.');
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
            width="200" // Setting explicit width
            height="200" // Setting explicit height (square for avatar)
            style={{
              borderRadius: '50%',
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
        width: 1200,  // Updated width to standard 1.91:1 aspect ratio
        height: 628,  // Updated height to standard 1.91:1 aspect ratio
      }
    );
  } catch (error) {
    console.error('Error generating image:', error.message);
    return new Response('Failed to generate image', { status: 500 });
  }
}
