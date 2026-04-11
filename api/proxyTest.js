// api/proxyTest.js
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { proxyHost, proxyPort, targetUrl = 'https://httpbin.org/ip' } = req.body;

  if (!proxyHost || !proxyPort) {
    return res.status(400).json({ error: 'Missing proxyHost or proxyPort' });
  }

  const proxyUrl = `http://${proxyHost}:${proxyPort}`;
  const agent = new HttpsProxyAgent(proxyUrl);

  try {
    const response = await fetch(targetUrl, {
      agent,
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    res.status(200).json({
      success: true,
      proxy: proxyUrl,
      target: targetUrl,
      status: response.status,
      data
    });
  } catch (err) {
    res.status(200).json({
      success: false,
      proxy: proxyUrl,
      error: err.message
    });
  }
}
