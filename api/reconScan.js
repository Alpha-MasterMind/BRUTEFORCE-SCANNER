// api/reconScan.js
const net = require('net');
const dns = require('dns').promises;
const fetch = require('node-fetch');

// Wordlist for subdomain enumeration
const SUBDOMAIN_WORDLIST = [
  'www', 'mail', 'api', 'dev', 'test', 'stage', 'prod', 'vpn',
  'admin', 'portal', 'auth', 'secure', 'cdn', 'docs', 'status',
  'billing', 'dashboard', 'support', 'app', 'shop'
];

// Port profiles
const PORT_PROFILES = {
  web:   [80, 443, 8080, 8443],
  proxy: [3128, 8888, 9090, 1080, 8118],
  admin: [8000, 8001, 8888, 9000],
  all:   [80, 443, 8080, 3128, 8888, 9090, 1080, 8000, 8001, 9000]
};

// Helper: Resolve domain to IPv4
async function resolveDomain(hostname) {
  try {
    return await dns.resolve4(hostname);
  } catch {
    return [];
  }
}

// Helper: Check if a port is open (TCP connect)
function checkPort(ip, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, ip);
  });
}

// Helper: Test if a port is an open HTTP proxy (simplified)
async function testProxy(ip, port, timeout = 5000) {
  // A simple heuristic: we'll mark common proxy ports as potential if open.
  // In a full implementation, you'd send a CONNECT request, but for brevity:
  const commonProxyPorts = [3128, 8888, 9090, 1080, 8118];
  return commonProxyPorts.includes(port);
}

// Helper: HTTP banner grab
async function httpBanner(host, port, timeout = 5000) {
  const protocol = port === 443 ? 'https' : 'http';
  const url = `${protocol}://${host}:${port}`;
  try {
    const res = await fetch(url, { method: 'HEAD', timeout });
    const server = res.headers.get('server') || null;
    const poweredBy = res.headers.get('x-powered-by') || null;
    return {
      status: res.status,
      server,
      headers: { 'X-Powered-By': poweredBy },
      title: null
    };
  } catch (err) {
    return { status: null, server: null, title: null };
  }
}

// Helper: GeoIP
async function geoIP(ip) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,org`);
    const data = await res.json();
    if (data.status === 'success') return data;
  } catch {}
  return null;
}

// Main handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domains, profile = 'all' } = req.body;
  if (!domains || !Array.isArray(domains)) {
    return res.status(400).json({ error: 'Missing domains array' });
  }

  const ports = PORT_PROFILES[profile] || PORT_PROFILES.all;
  const results = [];

  // Generate targets: base domains + subdomains
  const targets = [];
  for (const base of domains) {
    targets.push(base);
    for (const sub of SUBDOMAIN_WORDLIST) {
      targets.push(`${sub}.${base}`);
    }
  }

  for (const target of targets) {
    const ips = await resolveDomain(target);
    if (!ips.length) continue;

    const openPorts = [];
    for (const port of ports) {
      if (await checkPort(ips[0], port)) {
        openPorts.push(port);
      }
    }
    if (!openPorts.length) continue;

    // For each open port, do HTTP probe (if web port) and check proxy
    const httpResults = {};
    let proxyOk = false;
    for (const port of openPorts) {
      if ([80, 443, 8080, 8443].includes(port)) {
        httpResults[port] = await httpBanner(target, port);
      }
      proxyOk = proxyOk || await testProxy(ips[0], port);
    }

    const primaryPort = openPorts.find(p => [443, 80, 8080].includes(p)) || openPorts[0];
    const http = httpResults[primaryPort] || null;

    // GeoIP on first IP
    const geo = await geoIP(ips[0]);

    // Risk scoring (simplified)
    let score = 0;
    if (proxyOk) score += 20;
    if (openPorts.includes(8080) || openPorts.includes(8888)) score += 5;
    if (http?.server?.toLowerCase().includes('apache') || http?.server?.toLowerCase().includes('nginx')) score += 2;

    results.push({
      domain: target,
      ips,
      open_ports: openPorts,
      proxy_ok: proxyOk,
      highlight: proxyOk || openPorts.length > 5,
      score,
      http,
      geo
    });
  }

  res.status(200).json({ results });
}
