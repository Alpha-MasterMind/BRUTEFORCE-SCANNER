// pages/api/reconSingle.js
import net from 'net';
import dns from 'dns/promises';
import fetch from 'node-fetch';

const SUBDOMAINS = ['www', 'mail', 'api', 'vpn', 'admin', 'portal'];

const PORT_PROFILES = {
  web:   [80, 443, 8080, 8443],
  proxy: [3128, 8888, 9090, 1080, 8118],
  admin: [8000, 8001, 8888, 9000],
  all:   [80, 443, 8080, 3128, 8888, 9090, 1080, 8000, 8001, 9000]
};

// Simple in‑memory cache for geoIP (per function invocation, not persistent)
const geoCache = new Map();

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
  // Limit concurrency to avoid resource exhaustion
  const concurrency = 5;
  const results = [];
  for (let i = 0; i < ports.length; i += concurrency) {
    const chunk = ports.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map(p => checkPort(ip, p)));
    results.push(...chunkResults);
  }
  const open = [];
  ports.forEach((p, idx) => { if (results[idx]) open.push(p); });
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
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BruteforceScannerR/2.0)' }
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
  if (geoCache.has(ip)) return geoCache.get(ip);
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,org`);
    const data = await res.json();
    if (data.status === 'success') {
      geoCache.set(ip, data);
      return data;
    }
  } catch {}
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain, profile = 'web' } = req.body;
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid domain' });
  }

  const ports = PORT_PROFILES[profile] || PORT_PROFILES.web;
  const results = [];
  const targets = [domain, ...SUBDOMAINS.map(s => `${s}.${domain}`)];

  // Process targets with concurrency limit (avoid timeout)
  const concurrency = 2;
  for (let i = 0; i < targets.length; i += concurrency) {
    const chunk = targets.slice(i, i + concurrency);
    const chunkPromises = chunk.map(async (target) => {
      try {
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
      } catch {
        return null;
      }
    });

    const chunkResults = await Promise.allSettled(chunkPromises);
    chunkResults.forEach(r => {
      if (r.status === 'fulfilled' && r.value) results.push(r.value);
    });
  }

  res.status(200).json({ domain, results });
}
