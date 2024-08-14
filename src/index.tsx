import React from 'react';
import { Frog, Button } from 'frog';

export const app = new Frog({ title: 'Top Farcaster Trends' });

app.frame('/', async (c) => {
  try {
    const response = await fetch('/api/getTrends');
    const data = await response.json();
    const topics: string[] = data.topics;

    return c.res({
      image: (
        <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
          {topics.length > 0 ? (
            <ol>
              {topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ol>
          ) : (
            'No trending topics available'
          )}
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
        <div style={{ color: 'red', display: 'flex', fontSize: 60 }}>
          Error loading trends. Please try again.
        </div>
      ),
      intents: [
        <Button value="retry">Retry</Button>
      ]
    });
  }
});
