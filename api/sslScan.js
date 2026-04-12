import fetch from 'node-fetch';

const WHOISJSON_API_KEY = "77c8798ee484732cb2012ccfa85ea76d9c97cafef99db9d3f54b69fc11966a1e";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'Missing domain' });

  try {
    const response = await fetch(`https://whoisjson.com/api/v1/ssl-cert-check?domain=${encodeURIComponent(domain)}`, {
      headers: { Authorization: `TOKEN=${WHOISJSON_API_KEY}` },
      timeout: 15000
    });
    const data = await response.json();

    if (!data.valid) {
      return res.status(200).json({ error: 'SSL certificate not valid or could not be verified.' });
    }

    const issuer = data.issuer?.CN || data.issuer?.O || 'N/A';
    const validFrom = data.valid_from || 'N/A';
    const validTo = data.valid_to || 'N/A';
    const subjectCN = data.details?.subject?.CN || data.subject?.CN || 'N/A';
    const daysRemaining = data.days_remaining || null;

    res.status(200).json({
      success: true,
      domain,
      issuer,
      validFrom,
      validTo,
      subjectCN,
      daysRemaining,
      raw: data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
