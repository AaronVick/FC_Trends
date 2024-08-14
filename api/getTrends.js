import axios from 'axios';
import { pipeline } from '@huggingface/transformers';

// Create a summarizer with your Hugging Face API key
const summarizer = pipeline('summarization', 'facebook/bart-large-cnn', {
  apiKey: process.env.HUGGING_FACE_API_KEY
});

export default async function handler(req, res) {
  try {
    // Fetch top casts from Warpcast API
    const response = await axios.get('https://api.warpcast.com/v2/discover-actions?list=top&limit=10');
    const topCasts = response.data.result.actions.map(action => action.description).join('. ');

    // Process the list through Hugging Face to extract topics
    const summaries = await summarizer(topCasts, { max_length: 100, min_length: 5, do_sample: false });

    const topics = summaries[0].summary_text.split('.').filter(t => t).slice(0, 5);

    res.status(200).json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
}
