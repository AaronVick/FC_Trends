import Head from 'next/head';

export async function getServerSideProps() {
  const baseUrl = 'https://farcaster-trends.vercel.app';
  console.log('Base URL for initial frame:', baseUrl);
  return { props: { baseUrl } };
}

export default function Home({ baseUrl }) {
  return (
    <>
      <Head>
        <title>Trending Topics</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/api/generateInitialImage`} />
        <meta property="fc:frame:button:1" content="See Trends" />
        <meta property="fc:frame:post_url" content={`${baseUrl}/api/trendingFrame`} />
      </Head>
      <main>
        <h1>Trending Topics on Farcaster</h1>
        <p>This frame will display trending topics on Farcaster.</p>
      </main>
    </>
  );
}
