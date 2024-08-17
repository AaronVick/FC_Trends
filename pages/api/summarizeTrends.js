import axios from 'axios';
import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Attempting to fetch trending data from Pinata...');

      const pinataResponse = await axios.get('https://api.pinata.cloud/data/trending', {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_API_KEY}`,
        },
      });

      console.log('Data fetched from Pinata:', pinataResponse.data);

      const topCasts = pinataResponse.data.map(item => item.description).join(' ');
      console.log('Combined descriptions:', topCasts);

      const topics = extractKeyPhrases(topCasts);
      console.log('Extracted key phrases:', topics);

      res.status(200).json({ topics });
    } catch (error) {
      console.error('Error during processing:', error.message);
      res.status(500).json({ error: 'Failed to fetch and analyze trends' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
