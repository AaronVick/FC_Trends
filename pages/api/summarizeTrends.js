import axios from 'axios';
import natural from 'natural';
import lda from 'lda'; // Import the LDA library

const tokenizer = new natural.WordTokenizer();
const FARQUEST_API = 'https://build.far.quest/farcaster/v2';

async function getTrendingCasts(limit = 20) {
  try {
    const response = await axios.get(`${FARQUEST_API}/feed`, {
      headers: {
        'API-KEY': process.env.FARQUEST_API_KEY,
        'accept': 'application/json',
      },
      params: {
        limit,
      },
      timeout: 10000,
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    return response.data.result.casts;
  } catch (error) {
    console.error('Error getting trending casts:', error.message);
    throw error;
  }
}

function cleanText(text) {
  // Remove any non-alphanumeric characters except spaces
  return text.replace(/[^a-zA-Z\s]/g, '').toLowerCase();
}

function performTopicModeling(texts, numberOfTopics = 5, termsPerTopic = 3) {
  // Clean and prepare the texts for LDA
  const cleanedTexts = texts.map(text => cleanText(text));

  // Log cleaned texts for debugging
  console.log('Cleaned Texts:', cleanedTexts);

  // Perform LDA topic modeling on the cleaned text documents
  const topics = lda(cleanedTexts, numberOfTopics, termsPerTopic);

  // Extract the most significant terms for each topic
  return topics.map((topic, index) => ({
    topic: `Topic ${index + 1}`,
    terms: topic.map(term => term.term).join(', ')
  }));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Attempting to fetch trending casts from FarQuest API...');

      const casts = await getTrendingCasts();
      console.log('Fetched casts:', JSON.stringify(casts, null, 2));

      // Extract and clean text from trending casts
      const castTexts = casts.map(cast => cast.text);
      console.log('Extracted cast texts:', castTexts);

      const topics = performTopicModeling(castTexts, 5, 3);
      console.log('Extracted topics:', topics);

      res.status(200).json({ topics });
    } catch (error) {
      console.error('Error during processing:', error.message);
      res.status(500).json({ error: 'Failed to fetch and analyze trends', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
