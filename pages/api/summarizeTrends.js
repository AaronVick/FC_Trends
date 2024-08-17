import axios from 'axios';
import { GPT4All } from 'gpt4all';

const gpt4all = new GPT4All('gpt4all-j', true);

async function analyzeTopics(text) {
  await gpt4all.init();
  await gpt4all.open();

  const prompt = `Analyze the following text and identify the top 5 trending topics. Present them as a comma-separated list:

${text}

Top 5 trending topics:`;

  const response = await gpt4all.prompt(prompt);
  await gpt4all.close();

  return response.trim().split(',').map(topic => topic.trim());
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pinataResponse = await axios.get('https://api.pinata.cloud/data/trending');
      const topCasts = pinataResponse.data.map(item => item.description).join(' ');
      const topics = await analyzeTopics(topCasts);

      res.status(200).json({ topics });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch and analyze trends' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}