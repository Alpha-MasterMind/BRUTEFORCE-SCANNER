// pages/api/sslScan.js
import fetch from 'node-fetch';

// Use environment variable (set in Vercel dashboard)
const WHOISJSON_API_KEY = process.env.WHOISJSON_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain } = req.body;
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid domain' });
  }

  if (!WHOISJSON_API_KEY) {
    console.error('WHOISJSON_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch(
      `https://whoisjson.com/api/v1/ssl-cert-check?domain=${encodeURIComponent(domain)}`,
      {
        headers: { Authorization: `TOKEN=${WHOISJSON_API_KEY}` },
        timeout: 15000
      }
    );
    const data = await response.json();

    if (!data.valid) {
      return res.status(200).json({
        success: false,
        error: 'SSL certificate not valid or could not be verified.'
      });
    }

    const issuer = data.issuer?.CN || data.issuer?.O || 'N/A';
    const validFrom = data.valid_from || 'N/A';
    const validTo = data.valid_to || 'N/A';
    const subjectCN = data.details?.subject?.CN || data.subject?.CN || 'N/A';
    const daysRemaining = data.days_remaining ?? null;

    res.status(200).json({
      success: true,
      domain,
      issuer,
      validFrom,
      validTo,
      subjectCN,
      daysRemaining,
      // raw: data   // Optionally include full response (may be large)
    });
  } catch (err) {
    console.error('SSL scan error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve SSL certificate' });
  }
}
