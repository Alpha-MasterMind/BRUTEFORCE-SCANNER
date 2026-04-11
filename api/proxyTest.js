// api/proxyTest.js
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

const COMMON_PROXY_PORTS = [3128, 8888, 9090, 1080, 8118];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    proxyHost,
    ports = COMMON_PROXY_PORTS,
    targetUrl = 'https://httpbin.org/ip'
  } = req.body;

  if (!proxyHost) {
    return res.status(400).json({ error: 'Missing proxyHost' });
  }

  const results = [];

  for (const port of ports) {
    const proxyUrl = `http://${proxyHost}:${port}`;
    const result = { port, proxy: proxyUrl, success: false, error: null, data: null, status: null };

    try {
      // Use HTTPS proxy agent for all ports (SOCKS would need separate agent)
      const agent = new HttpsProxyAgent(proxyUrl);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(targetUrl, {
        agent,
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      clearTimeout(timer);

      const text = await response.text();
      try {
        result.data = JSON.parse(text);
      } catch {
        result.data = { raw: text.substring(0, 200) };
      }

      result.status = response.status;
      // Consider success if we got any HTTP response (even non-200 means proxy is reachable)
      result.success = true;
    } catch (err) {
      result.error = err.message;
    }

    results.push(result);
  }

  res.status(200).json({ host: proxyHost, results });
}
