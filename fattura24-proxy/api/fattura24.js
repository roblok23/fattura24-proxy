// api/fattura24.js — Vercel Serverless Function
// Proxy Fattura24 API per evitare CORS dal browser

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.FATTURA24_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'FATTURA24_API_KEY non configurata nelle env vars Vercel' });
  }

  const { endpoint = 'GetListDocumenti', params = {} } = req.body || {};

  const ALLOWED_ENDPOINTS = [
    'GetListDocumenti',
    'GetDocumento',
    'GetListClienti',
    'GetCliente',
  ];
  if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
    return res.status(400).json({ error: `Endpoint non permesso: ${endpoint}` });
  }

  const formData = new URLSearchParams();
  formData.append('apiKey', API_KEY);
  Object.entries(params).forEach(([k, v]) => formData.append(k, v));

  try {
    const response = await fetch(
      `https://www.app.fattura24.com/api/v0.3/${endpoint}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      }
    );

    const text = await response.text();

    // Fattura24 risponde in XML — lo passiamo raw al client
    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(text);
  } catch (err) {
    return res.status(502).json({ error: 'Errore chiamata Fattura24', detail: err.message });
  }
}
