import { Frog, Button } from 'frog'
import { handle } from 'frog/vercel'

export const app = new Frog({
  basePath: '/api',
  initialState: {
    topics: [] as string[]
  }
})

app.frame('/', (c) => {
  const { topics } = c.varsWithTypes<{ topics: string[] }>()
  
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60, flexDirection: 'column' }}>
        <h1>Top Farcaster Trends</h1>
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
      <Button action="fetch-trends">Fetch Trends</Button>
    ]
  })
})

app.frame('fetch-trends', async (c) => {
  try {
    const response = await fetch('https://your-api-endpoint.com/trends')
    const data = await response.json()
    const topics: string[] = data.topics

    return c.res({
      image: (
        <div style={{ color: 'white', display: 'flex', fontSize: 60, flexDirection: 'column' }}>
          <h1>Top Farcaster Trends</h1>
          <ol>
            {topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ol>
        </div>
      ),
      intents: [
        <Button action="/">Back</Button>,
        <Button action="fetch-trends">Refresh</Button>
      ]
    })
  } catch (error) {
    console.error('Error fetching trends:', error)
    return c.res({
      image: (
        <div style={{ color: 'red', display: 'flex', fontSize: 60 }}>
          Error loading trends. Please try again.
        </div>
      ),
      intents: [
        <Button action="fetch-trends">Retry</Button>
      ]
    })
  }
})

export const GET = handle(app)
export const POST = handle(app)