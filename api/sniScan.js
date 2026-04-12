import tls from 'tls';
import dns from 'dns/promises';
import fetch from 'node-fetch';

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
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const server = res.headers.get('server') || null;
    return { status: res.status, server, title: null };
  } catch (err) {
    return { status: null, server: null, title: null, error: err.message };
  }
}

async function geoIP(ip) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,org`);
    const data = await res.json();
    if (data.status === 'success') {
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

  if (!sni_hosts || !Array.isArray(sni_hosts)) {
    return res.status(400).json({ error: 'Missing sni_hosts array' });
  }

  const results = [];
  const targetIP = target_ip || (sni_hosts.length > 0 ? await resolveDomain(sni_hosts[0]) : null);

  if (!targetIP) {
    return res.status(400).json({ error: 'Could not determine target IP' });
  }

  for (const sni of sni_hosts) {
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

    results.push(result);
  }

  res.status(200).json({ tested: sni_hosts.length, results });
}
