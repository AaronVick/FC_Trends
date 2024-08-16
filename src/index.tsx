import React from 'react';
import { Frog, Button } from 'frog';
import { moxieData } from '@airstack/frog';

const moxieMiddleware = moxieData({
  apiKey: process.env.AIRSTACK_API_KEY, // Ensure this is set in your environment
  features: {
    moxieEarnings: true,
    trendingCasts: true,
    // Add more features as needed
  },
  env: 'production', // Adjust as needed
});

export const app = new Frog({ title: 'Top Farcaster Trends' });

app.frame('/', moxieMiddleware, async (c) => {
  try {
    const moxieEarnings = c.var.moxieEarnings || [];
    const trendingCasts = c.var.trendingCasts || [];

    // Generate content based on Moxie data
    return c.res({
      image: '/api/generateImage?topics=' + encodeURIComponent(JSON.stringify(trendingCasts)),
      intents: [
        <Button value="refresh">Refresh Trends</Button>
      ]
    });
  } catch (error) {
    console.error('Error fetching Moxie data:', error);
    return c.res({
      image: '/api/generateImage?placeholder=true',
      intents: [
        <Button value="retry">Retry</Button>
      ]
    });
  }
});
