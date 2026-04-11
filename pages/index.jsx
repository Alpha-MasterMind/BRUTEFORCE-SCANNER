// pages/index.jsx
import { useState } from "react";

const MOYA_DOMAINS = [
  "moya.app", "faqs.moya.app", "api.moya.app", "chat.moya.app",
  "app.moya.app", "www.moya.app", "m.moya.app", "static.moya.app",
  "cdn.moya.app", "media.moya.app", "assets.moya.app", "img.moya.app",
  "files.moya.app", "s3.moya.app", "push.moya.app", "ws.moya.app",
  "wss.moya.app", "auth.moya.app", "login.moya.app", "signup.moya.app",
  "account.moya.app", "portal.moya.app", "web.moya.app", "biz.moya.app",
  "business.moya.app", "news.moya.app", "moyanews.moya.app", "api2.moya.app",
  "gateway.moya.app", "backend.moya.app", "prod.moya.app", "staging.moya.app",
  "dev.moya.app", "test.moya.app",
];

const MTN_ZERO_RATED = [
  "nofunds.mtn.co.za", "mtn.co.za", "www.mtn.co.za",
  "onlinecms.mtn.co.za", "dev.onlinecms.mtn.co.za",
  "myaccount.mtn.co.za", "selfservice.mtn.co.za",
  "myconnect.mtn.co.za", "portal.mtn.co.za",
  "business.mtn.co.za", "api.mtn.co.za",
  "gn.total.com",
  "vodacom.co.za", "www.vodacom.co.za", "selfservice.vodacom.co.za",
  "telkom.co.za", "www.telkom.co.za",
  "cellc.co.za", "www.cellc.co.za",
  "rain.co.za", "www.rain.co.za",
];

const SA_ZERO_RATED_GOV = [
  "gov.za", "www.gov.za", "sacoronavirus.co.za",
  "health.gov.za", "education.gov.za", "dbe.gov.za",
  "sassa.gov.za", "ssa.gov.za", "dsd.gov.za",
  "dhet.gov.za", "umalusi.org.za", "nsfas.org.za",
];

const SA_ZERO_RATED_EDU = [
  "unisa.ac.za", "ukzn.ac.za", "wits.ac.za", "uct.ac.za",
  "up.ac.za", "univen.ac.za", "uwc.ac.za", "nmu.ac.za",
  "cut.ac.za", "dut.ac.za", "spu.ac.za", "ump.ac.za",
  "uz.ac.zw", "ru.ac.za", "sun.ac.za", "ufh.ac.za",
  "vut.ac.za", "cput.ac.za", "tut.ac.za", "mut.ac.za",
  "wsu.ac.za", "ul.ac.za", "nwu.ac.za", "unizulu.ac.za",
  "sabceducation.co.za", "saben.edu.za", "ienabler.co.za",
  "moodle.dut.ac.za", "blackboard.cput.ac.za",
  "dbe.gov.za", "tvetcolleges.co.za", "careerschoice.co.za",
];

const SA_MISC_ZERO_RATED = [
  "sabcnews.com", "ewn.co.za", "dailymaverick.co.za",
  "news24.com", "timeslive.co.za",
  "careers24.com", "www.careers24.com",
  "careersportal.co.za", "www.careersportal.co.za",
  "ncap.co.za", "covid19.who.int", "www.who.int",
  "stg.deserve.com", "sacoronavirus.co.za",
  "www.departmentofeducation.co.za",
  "www.communityneedles.com",
  "s2sacademy.co.za",
];

const ALL_SA_DOMAINS = [
  ...MOYA_DOMAINS,
  ...MTN_ZERO_RATED,
  ...SA_ZERO_RATED_GOV,
  ...SA_ZERO_RATED_EDU,
  ...SA_MISC_ZERO_RATED,
];

const PRESET_GROUPS = {
  "🟣 Moya.app (all)":    MOYA_DOMAINS,
  "🔴 MTN Zero-Rated":    MTN_ZERO_RATED,
  "🏛 Government":        SA_ZERO_RATED_GOV,
  "🎓 Universities/TVET": SA_ZERO_RATED_EDU,
  "📰 News & Other":      SA_MISC_ZERO_RATED,
  "🇿🇦 All SA Domains":  ALL_SA_DOMAINS,
};

const PORT_PROFILES = {
  web:   "80,443,8080,8443",
  proxy: "3128,8888,9090,1080,8118",
  admin: "8000,8001,8888,9000",
  all:   "80,443,8080,3128,8888,9090,1080,8000,8001,9000",
};

const PORT_RISK = {
  80: 2, 443: 2, 8080: 3, 8443: 2,
  3128: 8, 8888: 8, 9090: 7, 1080: 7, 8118: 7,
  8000: 6, 8001: 6, 9000: 6,
};

const PORT_LABELS = {
  3128: "SQUID", 8888: "PROXY", 9090: "PROXY",
  1080: "SOCKS", 8118: "PRIVOXY", 8080: "HTTP-ALT",
  8000: "ADMIN", 9000: "ADMIN",
};

const FLAGS = {
  "South Africa": "🇿🇦", "United States": "🇺🇸", "Germany": "🇩🇪",
  "Netherlands": "🇳🇱", "France": "🇫🇷", "United Kingdom": "🇬🇧",
  "Russia": "🇷🇺", "China": "🇨🇳", "Singapore": "🇸🇬",
};

// ─── Subcomponents ───────────────────────────────────────────────────

function RiskBadge({ port }) {
  const risk = PORT_RISK[port] || 2;
  const label = PORT_LABELS[port] || String(port);
  const cls = risk >= 7 ? "bg-red-500/20 text-red-300 border-red-500/40"
    : risk >= 5 ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
    : "bg-white/10 text-white/50 border-white/15";
  return <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${cls}`}>{label}</span>;
}

function ScoreDot({ score, max = 30 }) {
  const pct = Math.min(100, Math.round((score / max) * 100));
  const color = pct >= 70 ? "from-red-500 to-orange-500"
    : pct >= 40 ? "from-yellow-400 to-amber-500"
    : "from-blue-500 to-cyan-400";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-white/40">{score}</span>
    </div>
  );
}

function Chip({ children, color = "gray", glow = false }) {
  const c = {
    green: `bg-green-500/15 text-green-300 border-green-500/30 ${glow ? "shadow-[0_0_8px_#22c55e55]" : ""}`,
    red:   `bg-red-500/15 text-red-300 border-red-500/30 ${glow ? "shadow-[0_0_8px_#ef444455]" : ""}`,
    orange:"bg-orange-500/15 text-orange-300 border-orange-500/30",
    cyan:  "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    purple:"bg-purple-500/15 text-purple-300 border-purple-500/30",
    gray:  "bg-white/8 text-white/50 border-white/15",
  }[color];
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${c}`}>{children}</span>;
}

function StatCard({ label, value, color = "cyan", icon, sub }) {
  const cols = {
    red:    "text-red-400 border-red-500/20 bg-red-500/5",
    orange: "text-orange-400 border-orange-500/20 bg-orange-500/5",
    cyan:   "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    green:  "text-green-400 border-green-500/20 bg-green-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
  };
  return (
    <div className={`border rounded-xl p-4 ${cols[color]}`}>
      <div className="text-2xl font-bold font-mono">{icon} {value}</div>
      <div className="text-xs text-white/40 mt-1">{label}</div>
      {sub && <div className="text-[10px] text-white/20 mt-0.5">{sub}</div>}
    </div>
  );
}

function ProgressBar({ pct, color = "cyan" }) {
  const c = color === "green" ? "from-green-500 to-emerald-400" : "from-cyan-500 to-blue-500";
  return (
    <div className="w-full h-0.5 bg-white/10">
      <div className={`h-full bg-gradient-to-r ${c} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function ReconRow({ r, isNew }) {
  const [open, setOpen] = useState(false);
  const hl = r.highlight;
  const flag = FLAGS[r.geo?.country] || "🌍";
  return (
    <>
      <tr onClick={() => setOpen(o => !o)}
        className={`cursor-pointer transition border-b border-white/5 group text-xs
          ${hl ? "bg-red-950/25 hover:bg-red-950/40" : "hover:bg-white/4"}
          ${isNew ? "animate-pulse" : ""}`}>
        <td className="pl-3 w-3">
          <div className={`w-1.5 h-1.5 rounded-full ${hl ? "bg-red-500 shadow-[0_0_6px_#ef4444]" : "bg-white/10"}`} />
        </td>
        <td className="px-3 py-2.5"><ScoreDot score={r.score} /></td>
        <td className="px-3 py-2.5 font-mono text-cyan-300 max-w-[200px] truncate">{r.domain}</td>
        <td className="px-3 py-2.5 font-mono text-white/40">{(r.ips || []).slice(0, 1).join(", ")}</td>
        <td className="px-3 py-2.5"><div className="flex gap-1 flex-wrap">{(r.open_ports || []).map(p => <RiskBadge key={p} port={p} />)}</div></td>
        <td className="px-3 py-2.5">{r.proxy_ok ? <Chip color="red" glow>⚡ PROXY</Chip> : <span className="text-white/15">—</span>}</td>
        <td className="px-3 py-2.5 text-white/50 max-w-[160px] truncate">{r.http?.title || "—"}</td>
        <td className="px-3 py-2.5 text-white/35">{flag} {r.geo?.city || r.geo?.country || "—"}</td>
        <td className="px-3 py-2.5">
          {r.http?.status ? <span className={r.http.status < 300 ? "text-green-400" : r.http.status < 400 ? "text-yellow-400" : "text-red-400"}>{r.http.status}</span> : "—"}
        </td>
        <td className="px-2 py-2.5 text-white/20">{open ? "▾" : "▸"}</td>
      </tr>
      {open && (
        <tr className={`border-b border-white/5 ${hl ? "bg-red-950/15" : "bg-black/20"}`}>
          <td colSpan={10} className="px-6 py-4">
            <div className="grid grid-cols-3 gap-6 text-xs">
              <div className="space-y-1.5">
                <div className="text-white/25 uppercase tracking-widest text-[10px] mb-2">Network</div>
                <div><span className="text-white/30">IPs: </span><span className="font-mono text-white/60">{(r.ips || []).join(", ")}</span></div>
                <div><span className="text-white/30">Ports: </span><span className="font-mono text-white/60">{(r.open_ports || []).join(", ")}</span></div>
                <div><span className="text-white/30">Proxy: </span><span className={r.proxy_ok ? "text-red-400 font-mono" : "text-white/25"}>
                  {r.proxy_ok ? "✓ CONFIRMED OPEN PROXY" : "not detected"}
                </span></div>
              </div>
              <div className="space-y-1.5">
                <div className="text-white/25 uppercase tracking-widest text-[10px] mb-2">HTTP</div>
                <div><span className="text-white/30">Status: </span><span className="font-mono text-white/60">{r.http?.status || "—"}</span></div>
                <div><span className="text-white/30">Title: </span><span className="text-white/60">{r.http?.title || "—"}</span></div>
                <div><span className="text-white/30">Server: </span><span className="font-mono text-white/60">{r.http?.server || "—"}</span></div>
                <div><span className="text-white/30">X-Powered-By: </span><span className={r.http?.headers?.["X-Powered-By"] ? "text-orange-300 font-mono" : "text-white/25"}>{r.http?.headers?.["X-Powered-By"] || "—"}</span></div>
              </div>
              <div className="space-y-1.5">
                <div className="text-white/25 uppercase tracking-widest text-[10px] mb-2">GeoIP</div>
                <div><span className="text-white/30">Country: </span><span className="text-white/60">{flag} {r.geo?.country || "—"}</span></div>
                <div><span className="text-white/30">City: </span><span className="text-white/60">{r.geo?.city || "—"}</span></div>
                <div><span className="text-white/30">Org: </span><span className="text-white/60">{r.geo?.org || "—"}</span></div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function SNIRow({ r, idx }) {
  const [open, setOpen] = useState(false);
  const flag = FLAGS[r.geo?.country] || "🌍";
  return (
    <>
      <tr onClick={() => setOpen(o => !o)}
        className="cursor-pointer border-b border-white/5 hover:bg-green-950/20 transition text-xs group">
        <td className="pl-4 pr-2 py-2.5">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
        </td>
        <td className="px-3 py-2.5 font-mono text-green-300">{r.sni}</td>
        <td className="px-3 py-2.5 font-mono text-white/40">{r.ip}:{r.port}</td>
        <td className="px-3 py-2.5">
          {r.http?.status ? <span className={r.http.status < 300 ? "text-green-400" : "text-yellow-400"}>{r.http.status}</span> : "—"}
        </td>
        <td className="px-3 py-2.5 text-white/50 max-w-[200px] truncate">{r.http?.title || "—"}</td>
        <td className="px-3 py-2.5 text-white/35">{flag} {r.geo?.country || "—"}</td>
        <td className="px-3 py-2.5 font-mono text-white/25 text-[10px]">{new Date(r.timestamp).toLocaleTimeString()}</td>
        <td className="px-3 py-2.5"><Chip color="green" glow>✓ SNI OK</Chip></td>
        <td className="px-2 text-white/20">{open ? "▾" : "▸"}</td>
      </tr>
      {open && (
        <tr className="border-b border-white/5 bg-green-950/10">
          <td colSpan={9} className="px-6 py-3">
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-white/25 uppercase tracking-widest text-[10px] mb-1.5">SNI Details</div>
                <div><span className="text-white/30">Host: </span><span className="font-mono text-green-300">{r.sni}</span></div>
                <div><span className="text-white/30">IP: </span><span className="font-mono text-white/60">{r.ip}</span></div>
                <div><span className="text-white/30">Port: </span><span className="font-mono text-white/60">{r.port}</span></div>
                {r.error && <div><span className="text-white/30">Note: </span><span className="text-yellow-300/60 font-mono text-[10px]">{r.error}</span></div>}
              </div>
              <div className="space-y-1">
                <div className="text-white/25 uppercase tracking-widest text-[10px] mb-1.5">HTTP</div>
                <div><span className="text-white/30">Status: </span><span className="font-mono text-white/60">{r.http?.status || "—"}</span></div>
                <div><span className="text-white/30">Title: </span><span className="text-white/60">{r.http?.title || "—"}</span></div>
                <div><span className="text-white/30">Server: </span><span className="font-mono text-white/60">{r.http?.server || "—"}</span></div>
              </div>
              <div className="space-y-1">
                <div className="text-white/25 uppercase tracking-widest text-[10px] mb-1.5">GeoIP</div>
                <div><span className="text-white/30">Country: </span><span className="text-white/60">{flag} {r.geo?.country || "—"}</span></div>
                <div><span className="text-white/30">City: </span><span className="text-white/60">{r.geo?.city || "—"}</span></div>
                <div><span className="text-white/30">Org: </span><span className="text-white/60">{r.geo?.org || "—"}</span></div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

export default function Scanner() {
  const [tab, setTab] = useState("sni");

  // SNI state
  const [sniPreset, setSniPreset] = useState("🇿🇦 All SA Domains");
  const [sniCustomText, setSniCustomText] = useState("");
  const [sniTargetIP, setSniTargetIP] = useState("");
  const [sniPort, setSniPort] = useState("443");
  const [sniProbeHTTP, setSniProbeHTTP] = useState(true);
  const [sniProbeGeo, setSniProbeGeo] = useState(true);
  const [sniStatus, setSniStatus] = useState("idle");
  const [sniResults, setSniResults] = useState([]);
  const [sniTested, setSniTested] = useState(0);
  const [sniTotal, setSniTotal] = useState(0);
  const [sniError, setSniError] = useState("");
  const [sniFilter, setSniFilter] = useState("");

  // Recon state
  const [reconDomains, setReconDomains] = useState("accenture.com\nmtn.co.za\nvodacom.co.za");
  const [reconProfile, setReconProfile] = useState("all");
  const [reconStatus, setReconStatus] = useState("idle");
  const [reconResults, setReconResults] = useState([]);
  const [reconProgress, setReconProgress] = useState(0);
  const [reconError, setReconError] = useState("");
  const [reconFilter, setReconFilter] = useState("");
  const [showHighlights, setShowHighlights] = useState(false);

  // Proxy test state
  const [proxyHost, setProxyHost] = useState("");
  const [proxyPort, setProxyPort] = useState("3128");
  const [proxyTarget, setProxyTarget] = useState("https://httpbin.org/ip");
  const [proxyResult, setProxyResult] = useState(null);
  const [proxyLoading, setProxyLoading] = useState(false);

  const SUBDOMAINS = ['www', 'mail', 'api', 'vpn', 'admin', 'portal'];

  // ─── SNI Scan ──────────────────────────────────────────
  async function launchSNI() {
    setSniError(""); setSniResults([]); setSniTested(0);

    const hosts = sniCustomText.trim()
      ? sniCustomText.split("\n").map(s => s.trim()).filter(Boolean)
      : PRESET_GROUPS[sniPreset] || ALL_SA_DOMAINS;

    setSniTotal(hosts.length);
    setSniStatus("running");

    try {
      const response = await fetch('/api/sniScan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sni_hosts: hosts,
          target_ip: sniTargetIP || null,
          port: parseInt(sniPort) || 443,
          probe_http: sniProbeHTTP,
          probe_geo: sniProbeGeo
        })
      });
      const data = await response.json();
      if (data.error) {
        setSniError(data.error);
        setSniStatus("error");
      } else {
        setSniResults(data.results);
        setSniStatus("done");
        setSniTested(data.tested);
      }
    } catch (e) {
      setSniError(e.message);
      setSniStatus("error");
    }
  }

  // ─── Recon Scan (Chunked) ──────────────────────────────────────────
  async function launchRecon() {
    setReconError(""); 
    setReconResults([]); 
    setReconProgress(0);

    const domains = reconDomains.split("\n").map(s => s.trim()).filter(Boolean);
    if (!domains.length) { 
      setReconError("Enter at least one domain."); 
      return; 
    }

    setReconStatus("running");
    setReconProgress(5);

    const allResults = [];
    const concurrency = 3;
    const chunks = [];
    for (let i = 0; i < domains.length; i += concurrency) {
      chunks.push(domains.slice(i, i + concurrency));
    }

    try {
      for (const chunk of chunks) {
        const promises = chunk.map(async (domain) => {
          try {
            const response = await fetch('/api/reconSingle', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ domain, profile: reconProfile })
            });
            const data = await response.json();
            if (data.results) {
              allResults.push(...data.results);
            }
            setReconResults([...allResults]);
          } catch (err) {
            console.error(`Failed to scan ${domain}:`, err);
          }
        });
        await Promise.all(promises);
        
        const pct = Math.min(95, 5 + (allResults.length / (domains.length * (SUBDOMAINS.length + 1))) * 90);
        setReconProgress(pct);
      }
      
      setReconStatus("done");
      setReconProgress(100);
    } catch (e) {
      setReconError(e.message);
      setReconStatus("error");
    }
  }

  // ─── Proxy Test ─────────────────────────────────────────────────────
  async function testProxy() {
    if (!proxyHost || !proxyPort) {
      setProxyResult({ success: false, error: "Host and port required" });
      return;
    }
    setProxyLoading(true);
    setProxyResult(null);
    try {
      const res = await fetch('/api/proxyTest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxyHost, proxyPort, targetUrl: proxyTarget })
      });
      const data = await res.json();
      setProxyResult(data);
    } catch (err) {
      setProxyResult({ success: false, error: err.message });
    } finally {
      setProxyLoading(false);
    }
  }

  // ─── Export CSV ──────────────────────────────────────────
  function exportCSV(data, name) {
    const isSNI = data[0]?.sni;
    const headers = isSNI
      ? ["sni","ip","port","ok","http_status","title","server","country","city","org","timestamp"]
      : ["score","domain","ips","open_ports","proxy_ok","highlight","http_status","title","server","country","city","org"];
    const rows = data.map(r => isSNI
      ? [r.sni, r.ip, r.port, r.ok, r.http?.status, r.http?.title, r.http?.server, r.geo?.country, r.geo?.city, r.geo?.org, r.timestamp]
      : [r.score, r.domain, (r.ips||[]).join("|"), (r.open_ports||[]).join("|"), r.proxy_ok, r.highlight, r.http?.status, r.http?.title, r.http?.server, r.geo?.country, r.geo?.city, r.geo?.org]
    );
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v??"")}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${name}_${Date.now()}.csv`; a.click();
  }

  // ─── Filtered Data ──────────────────────────────────────────
  const sniDisplayed = sniResults.filter(r => !sniFilter || r.sni.includes(sniFilter) || (r.geo?.country || "").toLowerCase().includes(sniFilter.toLowerCase()));
  const reconLive = reconResults.filter(r => r.ips?.length);
  const reconDisplayed = reconLive.filter(r => {
    if (showHighlights && !r.highlight) return false;
    if (!reconFilter) return true;
    const q = reconFilter.toLowerCase();
    return r.domain.includes(q) || (r.ips||[]).join("").includes(q) || (r.http?.title||"").toLowerCase().includes(q) || (r.geo?.country||"").toLowerCase().includes(q);
  }).sort((a, b) => b.score - a.score);

  const scanning = sniStatus === "running" || reconStatus === "running";

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#060610] text-white font-mono text-sm">
      <div className="border-b border-white/10 bg-black/70 backdrop-blur sticky top-0 z-50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center font-black text-sm shadow-[0_0_16px_#ef444460]">B</div>
          <div>
            <div className="font-black text-sm tracking-widest text-white">BRUTEFORCE</div>
            <div className="text-[9px] text-white/25 tracking-widest uppercase">Recon Framework v2</div>
          </div>
          {scanning && (
            <div className="flex items-center gap-2 ml-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              <span className="text-xs text-red-400 font-mono tracking-widest">LIVE</span>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {[["sni","📡 SNI"],["recon","🔍 Recon"],["proxy","🧪 Proxy"],["history","📜 Log"]].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs tracking-wider transition ${tab === t ? "bg-white/10 text-white border border-white/20" : "text-white/25 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {scanning && <ProgressBar pct={tab === "sni" ? (sniResults.length / Math.max(1, sniTotal) * 100) : reconProgress} color={tab === "sni" ? "green" : "cyan"} />}

      <div className="max-w-screen-xl mx-auto px-5 py-5 space-y-4">

        {/* SNI Tab */}
        {tab === "sni" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-3">
                <div className="bg-white/4 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="text-[10px] text-white/25 uppercase tracking-widest">Domain Preset</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(PRESET_GROUPS).map(([name, domains]) => (
                      <button key={name} onClick={() => { setSniPreset(name); setSniCustomText(""); }}
                        className={`px-3 py-1.5 rounded-lg text-xs transition ${sniPreset === name && !sniCustomText ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"}`}>
                        {name} <span className="text-white/25 ml-1">({domains.length})</span>
                      </button>
                    ))}
                  </div>
                  {!sniCustomText && (
                    <div className="bg-black/40 border border-white/8 rounded-xl p-3 max-h-32 overflow-y-auto">
                      <div className="text-[9px] text-white/20 uppercase tracking-widest mb-2">{(PRESET_GROUPS[sniPreset] || []).length} hosts loaded</div>
                      <div className="flex flex-wrap gap-1">
                        {(PRESET_GROUPS[sniPreset] || []).map(d => (
                          <span key={d} className="text-[10px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest mb-1.5">Or paste custom list (overrides preset)</div>
                    <textarea value={sniCustomText} onChange={e => setSniCustomText(e.target.value)} rows={4}
                      placeholder={"moya.app\nnofunds.mtn.co.za\nuwc.ac.za\n..."}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-white/10 focus:outline-none focus:border-cyan-500/40 resize-none" />
                  </div>
                  <button onClick={launchSNI} disabled={sniStatus === "running"}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black tracking-widest text-sm hover:opacity-90 transition disabled:opacity-30 shadow-[0_0_20px_#22c55e30]">
                    {sniStatus === "running" ? "⟳ TESTING SNIs..." : "▶ BRUTEFORCE SNI"}
                  </button>
                  {sniError && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{sniError}</div>}
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/4 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="text-[10px] text-white/25 uppercase tracking-widest">Options</div>
                  <div>
                    <label className="text-[10px] text-white/20 uppercase block mb-1">Target IP (optional)</label>
                    <input value={sniTargetIP} onChange={e => setSniTargetIP(e.target.value)}
                      placeholder="Auto-resolve from hosts"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-green-500/40" />
                    <div className="text-[9px] text-white/15 mt-1">e.g. nofunds.mtn.co.za IP</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/20 uppercase block mb-1">Port</label>
                    <input value={sniPort} onChange={e => setSniPort(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-green-500/40" />
                  </div>
                  <div className="space-y-2">
                    {[[sniProbeHTTP, setSniProbeHTTP, "HTTP banner grab"],
                      [sniProbeGeo, setSniProbeGeo, "GeoIP lookup"]].map(([val, set, label], i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer">
                        <div onClick={() => set(v => !v)}
                          className={`w-8 h-4 rounded-full transition relative ${val ? "bg-green-500/40 border border-green-500/60" : "bg-white/10 border border-white/20"}`}>
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${val ? "left-4 bg-green-400" : "left-0.5 bg-white/30"}`} />
                        </div>
                        <span className="text-xs text-white/40">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {sniStatus !== "idle" && (
                  <div className="space-y-2">
                    <StatCard label="Working SNIs" value={sniResults.length} color="green" icon="✓" />
                    <StatCard label="IPs Tested" value={[...new Set(sniResults.map(r => r.ip))].length} color="cyan" icon="🌐" />
                    {sniResults.length > 0 && (
                      <StatCard label="Live (HTTP 200)" value={sniResults.filter(r => r.http?.status === 200).length} color="purple" icon="⚡" />
                    )}
                  </div>
                )}
              </div>
            </div>
            {sniDisplayed.length > 0 && (
              <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-mono text-sm font-bold">{sniDisplayed.length} WORKING SNI HOSTS</span>
                    <input value={sniFilter} onChange={e => setSniFilter(e.target.value)} placeholder="filter..."
                      className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-xs text-white placeholder-white/20 focus:outline-none w-40" />
                  </div>
                  <button onClick={() => exportCSV(sniDisplayed, "sni_working")} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition">⬇ CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[9px] text-white/20 uppercase tracking-widest border-b border-white/8">
                        <th className="w-4 pl-4" />
                        <th className="px-3 py-2 text-left">SNI Host</th>
                        <th className="px-3 py-2 text-left">IP:Port</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-left">Title</th>
                        <th className="px-3 py-2 text-left">Country</th>
                        <th className="px-3 py-2 text-left">Time</th>
                        <th className="px-3 py-2 text-left">Result</th>
                        <th className="w-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {sniDisplayed.map((r, i) => <SNIRow key={r.sni + i} r={r} idx={i} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {sniStatus === "idle" && (
              <div className="text-center py-20 space-y-3">
                <div className="text-5xl">📡</div>
                <div className="text-white/30 text-sm tracking-wider">SELECT A PRESET AND LAUNCH SNI BRUTEFORCE</div>
                <div className="text-white/15 text-xs">Tests TLS SNI handshake for each host — no VPS needed</div>
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  {Object.entries(PRESET_GROUPS).map(([name, d]) => (
                    <button key={name} onClick={() => { setSniPreset(name); launchSNI(); }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/40 transition">
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Recon Tab */}
        {tab === "recon" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-white/4 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="text-[10px] text-white/25 uppercase tracking-widest">Target Domains</div>
                <textarea value={reconDomains} onChange={e => setReconDomains(e.target.value)} rows={5}
                  placeholder="mtn.co.za&#10;vodacom.co.za&#10;moya.app"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-white/10 focus:outline-none focus:border-cyan-500/40 resize-none" />
                <button onClick={launchRecon} disabled={reconStatus === "running"}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-black tracking-widest text-sm hover:opacity-90 transition disabled:opacity-30 shadow-[0_0_20px_#ef444430]">
                  {reconStatus === "running" ? "⟳ SCANNING..." : "▶ LAUNCH RECON"}
                </button>
                {reconError && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{reconError}</div>}
              </div>
              <div className="bg-white/4 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="text-[10px] text-white/25 uppercase tracking-widest">Port Profile</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.keys(PORT_PROFILES).map(k => (
                    <button key={k} onClick={() => setReconProfile(k)}
                      className={`py-2 rounded-lg text-xs tracking-widest uppercase transition ${reconProfile === k ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "bg-white/5 text-white/30 border border-white/10 hover:bg-white/10"}`}>
                      {k}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-white/20 font-mono">{PORT_PROFILES[reconProfile]}</div>
              </div>
            </div>
            {reconLive.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                <StatCard label="Live" value={reconLive.length} color="cyan" icon="🎯" />
                <StatCard label="Highlights" value={reconLive.filter(r => r.highlight).length} color="red" icon="🔴" />
                <StatCard label="Proxies" value={reconLive.filter(r => r.proxy_ok).length} color="orange" icon="⚡" />
                <StatCard label="Titled" value={reconLive.filter(r => r.http?.title).length} color="purple" icon="🌐" />
                <StatCard label="GeoMapped" value={reconLive.filter(r => r.geo?.country).length} color="green" icon="🌍" />
              </div>
            )}
            {reconDisplayed.length > 0 && (
              <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <input value={reconFilter} onChange={e => setReconFilter(e.target.value)} placeholder="filter results..."
                      className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-xs text-white placeholder-white/15 focus:outline-none w-48" />
                    <button onClick={() => setShowHighlights(v => !v)}
                      className={`px-3 py-1 rounded-lg text-xs transition ${showHighlights ? "bg-red-500/20 text-red-300 border border-red-500/40" : "bg-white/5 text-white/30 border border-white/10"}`}>
                      🔴 Highlights
                    </button>
                  </div>
                  <button onClick={() => exportCSV(reconDisplayed, "recon")} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs">⬇ CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[9px] text-white/20 uppercase tracking-widest border-b border-white/8">
                        <th className="w-3 pl-3" /><th className="px-3 py-2 text-left">Score</th><th className="px-3 py-2 text-left">Domain</th>
                        <th className="px-3 py-2 text-left">IP</th><th className="px-3 py-2 text-left">Ports</th><th className="px-3 py-2 text-left">Proxy</th>
                        <th className="px-3 py-2 text-left">Title</th><th className="px-3 py-2 text-left">Geo</th><th className="px-3 py-2 text-left">HTTP</th><th className="w-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {reconDisplayed.map((r, i) => <ReconRow key={r.domain + i} r={r} isNew={false} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {reconStatus === "idle" && reconLive.length === 0 && (
              <div className="text-center py-20 space-y-3">
                <div className="text-5xl">🔍</div>
                <div className="text-white/30 text-sm tracking-wider">ENTER DOMAINS AND LAUNCH RECON</div>
                <div className="text-white/15 text-xs">Subdomain enum + port scan + proxy detection</div>
              </div>
            )}
          </>
        )}

        {/* Proxy Test Tab */}
        {tab === "proxy" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/4 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="text-[10px] text-white/25 uppercase tracking-widest">Proxy Tester</div>
              <div>
                <label className="text-[10px] text-white/20 uppercase block mb-1">Proxy Host</label>
                <input value={proxyHost} onChange={e => setProxyHost(e.target.value)}
                  placeholder="e.g., api.vodacom.co.za"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/40" />
              </div>
              <div>
                <label className="text-[10px] text-white/20 uppercase block mb-1">Proxy Port</label>
                <input value={proxyPort} onChange={e => setProxyPort(e.target.value)}
                  placeholder="3128"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/40" />
              </div>
              <div>
                <label className="text-[10px] text-white/20 uppercase block mb-1">Target URL</label>
                <input value={proxyTarget} onChange={e => setProxyTarget(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/40" />
              </div>
              <button onClick={testProxy} disabled={proxyLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black tracking-widest text-sm hover:opacity-90 transition disabled:opacity-30">
                {proxyLoading ? "TESTING..." : "▶ TEST PROXY"}
              </button>
              {proxyResult && (
                <div className={`p-4 rounded-xl border ${proxyResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className="text-xs font-mono">
                    <span className="text-white/50">Proxy:</span> {proxyResult.proxy}
                  </div>
                  {proxyResult.success ? (
                    <>
                      <div className="text-xs font-mono mt-2">
                        <span className="text-white/50">Status:</span> {proxyResult.status}
                      </div>
                      <div className="text-xs font-mono mt-2 break-all">
                        <span className="text-white/50">Response:</span>
                        <pre className="text-green-300 text-[10px] mt-1 overflow-x-auto">{JSON.stringify(proxyResult.data, null, 2)}</pre>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs font-mono mt-2 text-red-300">
                      Error: {proxyResult.error}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="bg-white/4 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="text-[10px] text-white/25 uppercase tracking-widest">How to Use</div>
              <ol className="text-xs text-white/40 space-y-2 list-decimal list-inside">
                <li>Enter the proxy host and port (e.g., from Recon results).</li>
                <li>Target URL defaults to httpbin.org/ip to show your external IP.</li>
                <li>Click "Test Proxy".</li>
                <li>If successful, the response will show the IP address of the proxy server.</li>
                <li className="text-yellow-400/60">⚠️ Only test on authorized networks.</li>
              </ol>
            </div>
          </div>
        )}

        {/* History Tab (placeholder) */}
        {tab === "history" && (
          <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 text-[10px] text-white/25 uppercase tracking-widest">Scan Log</div>
            <div className="py-16 text-center text-white/15 text-sm">History not implemented yet — coming soon.</div>
          </div>
        )}
      </div>
    </div>
  );
      }
