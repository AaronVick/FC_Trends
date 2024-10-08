import axios from 'axios';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const baseUrl = 'https://farcaster-trends.vercel.app';
    console.log('Base URL:', baseUrl);

    const response = await axios.get(`${baseUrl}/api/summarizeTrends`);
    const topics = response.data.topics;
    console.log('Summarized topics fetched:', topics);

    // Generate image URL
    const imageUrl = `${baseUrl}/api/generateImage?topics=${encodeURIComponent(JSON.stringify(topics))}`;
    console.log('Generated image URL:', imageUrl);

    const warpcastComposeUrl = "https://warpcast.com/~/compose?text=Check+out+Trending+Topics+on+Farcaster%0A%0AFrame+by+%40aaronv.eth&embeds[]=https%3A%2F%2Ffarcaster-trends.vercel.app%2F";

    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Trending Topics on Farcaster</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="Share" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="${warpcastComposeUrl}" />
        </head>
        <body>
          <h1>Trending Topics on Farcaster</h1>
          <p>Share the latest trending topics with your network on Farcaster.</p>
        </body>
      </html>
    `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    console.error('Error generating frame:', error);
    return new Response('Error generating frame', { status: 500 });
  }
}
