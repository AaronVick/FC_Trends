const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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

  images: {
    domains: ['success-omega.vercel.app', 'pinata.cloud'],
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_BUILD_TIME': JSON.stringify(new Date().toISOString()),
      })
    );

    // Add rule for gpt4all
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Important: return the modified config
    return config;
  },

  // Enable WebAssembly
  experimental: {
    asyncWebAssembly: true,
  },
};

module.exports = nextConfig;