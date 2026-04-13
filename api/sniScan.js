// pages/api/sniScan.js
import tls from 'tls';
import dns from 'dns/promises';
import fetch from 'node-fetch';

const geoCache = new Map();

async function resolveDomain(hostname) {
  try {
    const addresses = await dns.resolve4(hostname);
    return addresses[0] || null;
  } catch {
    return null;
  }
}

function testSNI(ip, port, sniHost) {
  return new Promise((resolve) => {
    const socket = tls.connect({
      host: ip,
      port: port,
      servername: sniHost,
      rejectUnauthorized: false,
      timeout: 5000
    }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      resolve({
        ok: true,
        subject: cert.subject?.CN || null,
        issuer: cert.issuer?.CN || null
      });
    });
    socket.on('error', (err) => {
      socket.destroy();
      resolve({ ok: false, error: err.code || err.message });
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ ok: false, error: 'timeout' });
    });
  });
}

async function httpProbe(host, port = 443) {
  const protocol = port === 443 ? 'https' : 'http';
  const url = `${protocol}://${host}:${port}`;
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      timeout: 5000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BruteforceScannerR/2.0)' }
    });
    const server = res.headers.get('server') || null;
    return { status: res.status, server, title: null };
  } catch (err) {
    return { status: null, server: null, title: null, error: err.message };
  }
}

async function geoIP(ip) {
  if (geoCache.has(ip)) return geoCache.get(ip);
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,org`);
    const data = await res.json();
    if (data.status === 'success') {
      geoCache.set(ip, data);
      return {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        org: data.org
      };
    }
  } catch {}
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sni_hosts, target_ip, port = 443, probe_http = true, probe_geo = true } = req.body;

  if (!sni_hosts || !Array.isArray(sni_hosts) || sni_hosts.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid sni_hosts array' });
  }

  // Determine target IP
  let targetIP = target_ip;
  if (!targetIP && sni_hosts.length > 0) {
    targetIP = await resolveDomain(sni_hosts[0]);
  }
  if (!targetIP) {
    return res.status(400).json({ error: 'Could not determine target IP' });
  }

  const results = [];
  // Process SNI hosts with concurrency limit
  const SNI_CONCURRENCY = 5;

  for (let i = 0; i < sni_hosts.length; i += SNI_CONCURRENCY) {
    const chunk = sni_hosts.slice(i, i + SNI_CONCURRENCY);
    const chunkPromises = chunk.map(async (sni) => {
      const handshake = await testSNI(targetIP, port, sni);
      const result = {
        sni,
        ip: targetIP,
        port,
        ok: handshake.ok,
        error: handshake.error,
        http: null,
        geo: null,
        timestamp: new Date().toISOString()
      };

      if (handshake.ok) {
        if (probe_http) result.http = await httpProbe(sni, port);
        if (probe_geo) result.geo = await geoIP(targetIP);
      }

      return result;
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
  }

  res.status(200).json({ tested: sni_hosts.length, results });
}
