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

// Function to process Farcaster data
function processFarcasterData(data) {
  // Check if 'casts' is an array, if not, wrap it in an array
  const castsArray = Array.isArray(data.result.casts) ? data.result.casts : [data.result.casts];

  // Map through each cast in the array
  const processedCasts = castsArray.map(cast => {
    return {
      hash: cast.hash,
      text: cast.text,
      author: {
        fid: cast.author.fid,
        username: cast.author.username,
        displayName: cast.author.displayName,
        followerCount: cast.author.followerCount
      },
      channel: cast.channel ? {
        name: cast.channel.name,
        followerCount: cast.channel.followerCount
      } : null,
      childCasts: cast.childrenCasts ? cast.childrenCasts.map(childCast => ({
        hash: childCast.hash,
        text: childCast.text,
        author: {
          fid: childCast.author.fid,
          username: childCast.author.username,
          displayName: childCast.author.displayName,
          followerCount: childCast.author.followerCount
        }
      })) : []
    };
  });

  return processedCasts;
}

// Function to map processed data to a desired structure
function mapFarcasterDataToOutput(processedCasts) {
  return processedCasts.map(cast => {
    return {
      castId: cast.hash,
      content: cast.text,
      user: {
        id: cast.author.fid,
        name: cast.author.displayName,
        handle: cast.author.username,
        followers: cast.author.followerCount
      },
      channelInfo: cast.channel ? {
        title: cast.channel.name,
        subscribers: cast.channel.followerCount
      } : null,
      responses: cast.childCasts.map(child => ({
        responseId: child.hash,
        responseContent: child.text,
        responder: {
          id: child.author.fid,
          name: child.author.displayName,
          handle: child.author.username,
          followers: child.author.followerCount
        }
      }))
    };
  });
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

    return response.data;
  } catch (error) {
    console.error('Error getting trending casts:', error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Attempting to fetch trending casts from FarQuest API...');

      const trendingCasts = await getTrendingCasts();
      console.log('Fetched trending casts:', JSON.stringify(trendingCasts, null, 2));

      // Process the Farcaster data to get the structured output
      const processedCasts = processFarcasterData(trendingCasts);
      const mappedCasts = mapFarcasterDataToOutput(processedCasts);

      console.log('Processed and mapped Farcaster data:', JSON.stringify(mappedCasts, null, 2));

      // Extract text from trending casts
      const castTexts = mappedCasts.map(cast => cast.content).join(' ');

      console.log('Combined cast texts:', castTexts);

      const topics = extractKeyPhrases(castTexts);
      console.log('Extracted key phrases:', topics);

      res.status(200).json({ topics, mappedCasts });
    } catch (error) {
      console.error('Error during processing:', error.message);
      res.status(500).json({ error: 'Failed to fetch and analyze trends', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
