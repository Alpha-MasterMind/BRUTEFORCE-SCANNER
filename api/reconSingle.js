// api/reconSingle.js
import net from 'net';
import dns from 'dns/promises';
import fetch from 'node-fetch';

// Reduced subdomain list for speed
const SUBDOMAINS = ['www', 'mail', 'api', 'vpn', 'admin', 'portal'];

const PORT_PROFILES = {
  web:   [80, 443, 8080, 8443],
  proxy: [3128, 8888, 9090, 1080, 8118],
  admin: [8000, 8001, 8888, 9000],
  all:   [80, 443, 8080, 3128, 8888, 9090, 1080, 8000, 8001, 9000]
};

async function resolveDomain(hostname) {
  try {
    return await dns.resolve4(hostname);
  } catch {
    return [];
  }
}

function checkPort(ip, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeout);
    socket.on('connect', () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, ip);
  });
}

async function scanPorts(ip, ports) {
  const results = await Promise.allSettled(ports.map(p => checkPort(ip, p)));
  const open = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value) open.push(ports[i]);
  });
  return open;
}

async function httpBanner(host, port, timeout = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const protocol = port === 443 ? 'https' : 'http';
  const url = `${protocol}://${host}:${port}`;
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    clearTimeout(timer);
    return {
      status: res.status,
      server: res.headers.get('server') || null,
      headers: { 'X-Powered-By': res.headers.get('x-powered-by') || null },
      title: null
    };
  } catch {
    clearTimeout(timer);
    return { status: null, server: null, title: null };
  }
}

async function geoIP(ip) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,org`);
    const data = await res.json();
    return data.status === 'success' ? data : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain, profile = 'web' } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'Missing domain' });
  }

  const ports = PORT_PROFILES[profile] || PORT_PROFILES.web;
  const results = [];

  // Build target list
  const targets = [domain, ...SUBDOMAINS.map(s => `${s}.${domain}`)];

  for (const target of targets) {
    // Set per‑target timeout (prevents hanging)
    const targetPromise = (async () => {
      const ips = await resolveDomain(target);
      if (!ips.length) return null;

      const openPorts = await scanPorts(ips[0], ports);
      if (!openPorts.length) return null;

      const webPort = openPorts.find(p => [80, 443, 8080, 8443].includes(p));
      const http = webPort ? await httpBanner(target, webPort) : null;
      const proxyOk = openPorts.some(p => [3128, 8888, 9090, 1080, 8118].includes(p));
      const geo = await geoIP(ips[0]);

      let score = 0;
      if (proxyOk) score += 20;
      if (openPorts.includes(8080) || openPorts.includes(8888)) score += 5;
      if (http?.server?.toLowerCase().includes('apache') || http?.server?.toLowerCase().includes('nginx')) score += 2;

      return {
        domain: target,
        ips,
        open_ports: openPorts,
        proxy_ok: proxyOk,
        highlight: proxyOk || openPorts.length > 5,
        score,
        http,
        geo
      };
    })();

    // 10‑second max per target (keeps overall function fast)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('target_timeout')), 10000)
    );

    try {
      const result = await Promise.race([targetPromise, timeoutPromise]);
      if (result) results.push(result);
    } catch {
      // Skip this target, continue with others
    }
  }

  res.status(200).json({ domain, results });
}
