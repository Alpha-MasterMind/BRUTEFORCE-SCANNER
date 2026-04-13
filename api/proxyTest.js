// pages/api/proxyTest.js (or api/proxyTest.js)
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Default ports if none provided
const DEFAULT_PROXY_PORTS = [3128, 8888, 9090, 1080, 8118];

// Helper to extract clean hostname from input
function extractHostname(input) {
  try {
    const url = new URL(input.startsWith('http') ? input : `http://${input}`);
    return url.hostname;
  } catch {
    return input.split(':')[0]; // fallback
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { proxyHost, ports, targetUrl = 'https://httpbin.org/ip' } = req.body;

  if (!proxyHost) {
    return res.status(400).json({ error: 'Missing proxyHost' });
  }

  // Clean hostname
  proxyHost = extractHostname(proxyHost);

  // Parse ports (use provided or default)
  let portList;
  if (ports && Array.isArray(ports)) {
    portList = ports.filter(p => Number.isInteger(p) && p > 0 && p < 65536);
  } else if (typeof ports === 'string') {
    portList = ports.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p) && p > 0 && p < 65536);
  } else {
    portList = DEFAULT_PROXY_PORTS;
  }

  if (portList.length === 0) {
    portList = DEFAULT_PROXY_PORTS;
  }

  const results = [];
  const timeoutMs = 8000; // Vercel hobby max 10s, keep safe margin

  for (const port of portList) {
    const proxyUrl = `http://${proxyHost}:${port}`;
    const result = { port, proxy: proxyUrl, success: false, error: null, data: null, status: null };

    try {
      const agent = new HttpsProxyAgent(proxyUrl);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(targetUrl, {
        agent,
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BruteforceScannerR/2.0)' }
      });

      clearTimeout(timer);
      const text = await response.text();
      try {
        result.data = JSON.parse(text);
      } catch {
        result.data = { raw: text.substring(0, 500) };
      }
      result.status = response.status;
      result.success = true;
    } catch (err) {
      result.error = err.message;
    }

    results.push(result);
  }

  res.status(200).json({ host: proxyHost, results });
}
