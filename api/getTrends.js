import axios from 'axios';
import { pipeline } from '@huggingface/transformers';
import { moxieData } from '@airstack/frog';

// Create a summarizer with your Hugging Face API key
const summarizer = pipeline('summarization', 'facebook/bart-large-cnn', {
  apiKey: process.env.HUGGING_FACE_API_KEY,
});

export default async function handler(req, res) {
  try {
    // Fetch Moxie data using the middleware
    const moxieResponse = await moxieData({
      apiKey: process.env.AIRSTACK_API_KEY,
      features: {
        trendingCasts: true,
      },
      env: 'production',
    });

    const topCasts = moxieResponse.trendingCasts.map(cast => cast.description).join('. ');

    // Process the list through Hugging Face to extract topics
    const summaries = await summarizer(topCasts, { max_length: 100, min_length: 5, do_sample: false });
    const topics = summaries[0].summary_text.split('.').filter(t => t).slice(0, 5);

    res.status(200).json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
}
