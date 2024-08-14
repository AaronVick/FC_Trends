import { Button, Frog } from 'frog';

export const app = new Frog({ title: 'Top Farcaster Trends' });

app.frame('/', async (c) => {
  try {
    // Fetch top trends using the API created in getTrends.js
    const response = await fetch('/api/getTrends');
    const data = await response.json();
    const topics = data.topics;

    // Return the frame's content
    return c.res({
      image: (
        <div style={{ color: 'white', display: 'flex', flexDirection: 'column', fontSize: 40 }}>
          <h1>Top Farcaster Trends</h1>
          <ol>
            {topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ol>
        </div>
      ),
      intents: [
        <Button value="refresh">Refresh Trends</Button>
      ]
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return c.res({
      image: (
        <div style={{ color: 'red', fontSize: 20 }}>
          Error fetching trends. Please try again later.
        </div>
      )
    });
  }
});
