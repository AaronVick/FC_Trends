import axios from 'axios';
import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

const FARQUEST_API = 'https://build.far.quest/farcaster/v2';

function extractKeyPhrases(text, n = 5) {
  const tfidf = new TfIdf();
  
  // Tokenize and add the document
  const tokens = tokenizer.tokenize(text.toLowerCase());
  tfidf.addDocument(tokens);

  // Calculate scores for each term
  const scores = {};
  tfidf.listTerms(0 /*document index*/).forEach(item => {
    scores[item.term] = item.tfidf;
  });

  // Extract key phrases (bigrams and trigrams)
  const phrases = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = tokens.slice(i, i + 2).join(' ');
    const trigram = tokens.slice(i, i + 3).join(' ');
    phrases.push(bigram, trigram);
  }

  // Score phrases
  const phraseScores = phrases.map(phrase => ({
    phrase,
    score: phrase.split(' ').reduce((sum, term) => sum + (scores[term] || 0), 0)
  }));

  // Sort and return top n phrases
  return phraseScores
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map(item => item.phrase);
}

async function getTrendingCasts(limit = 20) {
  try {
    const response = await axios.get(`${FARQUEST_API}/feed`, {
      headers: {
        'API-KEY': process.env.FARQUEST_API_KEY,  // Use your actual API key stored in Vercel
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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Attempting to fetch trending casts from FarQuest API...');

      const casts = await getTrendingCasts();
      console.log('Fetched casts:', JSON.stringify(casts, null, 2));

      // Extract text from trending casts
      const castTexts = casts.map(cast => cast.text).join(' ');
      console.log('Combined cast texts:', castTexts);

      const topics = extractKeyPhrases(castTexts);
      console.log('Extracted key phrases:', topics);

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
