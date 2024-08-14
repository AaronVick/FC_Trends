import React from 'react';
import { Frog, Button, TextElement } from 'frog';

export const app = new Frog({ title: 'Top Farcaster Trends' });

app.frame('/', async (c) => {
  try {
    const response = await fetch('/api/getTrends');
    const data = await response.json();
    const topics: string[] = data.topics;

    return c.res({
      image: await (
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
      ) as unknown as TextElement,
      intents: [
        <Button.Reset>Refresh Trends</Button.Reset>
      ]
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return c.res({
      image: await (
        <div style={{ color: 'red', display: 'flex', fontSize: 60 }}>
          Error loading trends. Please try again.
        </div>
      ) as unknown as TextElement,
      intents: [
        <Button.Reset>Retry</Button.Reset>
      ]
    });
  }
});