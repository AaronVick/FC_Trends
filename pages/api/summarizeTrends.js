import axios from 'axios';
import { pipeline } from '@huggingface/transformers';

const summarizer = pipeline('summarization', 'facebook/bart-large-cnn', {
  apiKey: process.env.HUGGING_FACE_API_KEY,
});

export default async function handler(req, res) {
  try {
    const pinataResponse = await axios.get('https://api.pinata.cloud/data/trending');
    const topCasts = pinataResponse.data.map(item => item.description).join('. ');

    const summaries = await summarizer(topCasts, { max_length: 100, min_length: 5, do_sample: false });
    const topics = summaries[0].summary_text.split('.').filter(t => t).slice(0, 5);

    res.status(200).json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch and summarize trends' });
  }
}