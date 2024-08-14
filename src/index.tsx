import { Frog, FrameIntent } from 'frog';

export const app = new Frog({ title: 'Top Farcaster Trends' });

app.frame('/', async (c) => {
  try {
    // Fetch top trends using the API created in getTrends.js
    const response = await fetch('/api/getTrends');
    const data = await response.json();
    const topics = data.topics;

    // Generate the appropriate image URL based on the topics
    const imageUrl = topics.length > 0 ? `/api/generateImage?topics=${encodeURIComponent(JSON.stringify(topics))}` : '/api/generateImage?placeholder=true';

    // Define the intents as an array of FrameIntent objects
    const intents: FrameIntent[] = [
      { type: 'Button', value: 'refresh', label: 'Refresh Trends' }
    ];

    // Return the frame's content with the generated image URL and intents
    return c.res({
      image: imageUrl,
      intents: intents
    });
  } catch (error) {
    console.error('Error fetching trends:', error);

    // Return an error image in case fetching trends fails
    return c.res({
      image: '/api/generateImage?placeholder=true',
      intents: [
        { type: 'Button', value: 'retry', label: 'Retry' }
      ]
    });
  }
});
