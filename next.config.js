const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Ensure your API routes and static files can be accessed properly
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow all origins
          },
        ],
      },
    ];
  },

  // Allow images from specific domains
  images: {
    domains: ['success-omega.vercel.app', 'pinata.cloud'], // Add any domains you might fetch images from
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_BUILD_TIME': JSON.stringify(new Date().toISOString()),
      })
    );
    return config;
  },

  // Standalone output for serverless environments
  experimental: {
    outputStandalone: true,
  },
};

module.exports = nextConfig;
