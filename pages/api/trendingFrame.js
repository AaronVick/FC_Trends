import axios from 'axios';
import { pipeline } from '@huggingface/transformers';
import { ImageResponse } from '@vercel/og';

const summarizer = pipeline('summarization', 'facebook/bart-large-cnn', {
  apiKey: process.env.HUGGING_FACE_API_KEY,
});

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req, res) {
  try {
    // Fetch trending data from Pinata without API keys
    const pinataResponse = await axios.get('https://api.pinata.cloud/data/trending');

    const topCasts = pinataResponse.data.map(item => item.description).join('. ');

    // Process the list through Hugging Face to extract topics
    const summaries = await summarizer(topCasts, { max_length: 100, min_length: 5, do_sample: false });
    const topics = summaries[0].summary_text.split('.').filter(t => t).slice(0, 5);

    const topicsText = topics.join(', ');

    const imageResponse = new ImageResponse(
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
        height: 630, // 1.91:1 aspect ratio
      }
    );

    const warpcastComposeUrl = "https://warpcast.com/~/compose?text=Check+out+Trending+Topics+on+Farcaster%0A%0AFrame+by+%40aaronv.eth&embeds[]=https%3A%2F%2Faaron-v-fan-token.vercel.app%2F";

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Trending Topics on Farcaster</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${req.url}" />
          <meta property="fc:frame:button:1" content="Share" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="${warpcastComposeUrl}" />
        </head>
        <body>
          <h1>Trending Topics on Farcaster</h1>
          <p>Share the latest trending topics with your network on Farcaster.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
        </head>
        <body>
          <h1>Error Fetching Trends</h1>
          <p>An error occurred while trying to fetch the trending topics. Please try again later.</p>
        </body>
      </html>
    `);
  }
}
