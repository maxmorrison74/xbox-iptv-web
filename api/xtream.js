// Vercel Serverless Function - API Proxy
// File: api/xtream.js

export default async function handler(req, res) {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }
  
  try {
    const response = await fetch(decodeURIComponent(url));
    const data = await response.text();
    
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
