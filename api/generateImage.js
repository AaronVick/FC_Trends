import { createCanvas } from 'canvas';

export default async function handler(req, res) {
  const { topics } = req.body;

  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Background color
  ctx.fillStyle = '#282c34';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cool graphic for the title
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#61dafb';
  ctx.fillText('Top Farcaster Trends', 50, 100);

  // Render the topics
  ctx.font = 'bold 30px Arial';
  ctx.fillStyle = '#ffffff';
  topics.forEach((topic, index) => {
    ctx.fillText(`${index + 1}. ${topic}`, 50, 150 + index * 50);
  });

  // Convert canvas to a buffer and send as response
  const buffer = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
}
