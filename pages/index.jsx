// pages/index.jsx
import { useState, useEffect, useMemo } from "react";
import Head from 'next/head';
import toast from 'react-hot-toast';
import { FiCopy, FiMoon, FiSun, FiChevronDown, FiChevronUp, FiShield, FiGlobe, FiZap, FiActivity } from 'react-icons/fi';
import { useTheme } from 'next-themes';

// ==================== SPLASH SCREEN SEQUENCE ====================
const SPLASH_STAGES = [
  {
    image: '/authorization.jpg',
    text: 'DECRYPTING ACCESS...',
    subtext: 'AUTHORIZATION',
    duration: 2000
  },
  {
    image: '/system-booting.jpg',
    text: 'SYSTEM BOOTING...',
    subtext: 'Initializing Modules...\nLoading Exploit Library...\nConfiguring Network...\nWordlist Loaded: 10,000 Keys\nBruteforce Engine: ACTIVE',
    duration: 2500
  },
  {
    image: '/breaching.jpg',
    text: 'BREACH IN-PROGRESS',
    subtext: 'BREACHING',
    progress: 64,
    duration: 2000
  },
  {
    image: '/access-granted.jpg',
    text: 'ACCESS GRANTED',
    subtext: 'Welcome, Operator',
    duration: 1500
  }
];

// ==================== EXPANDED ZERO-RATED DOMAINS ====================
// MTN-specific zero-rated
const MTN_DOMAINS = [
  "mtn.co.za", "www.mtn.co.za", "nofunds.mtn.co.za", "onlinecms.mtn.co.za",
  "dev.onlinecms.mtn.co.za", "myaccount.mtn.co.za", "selfservice.mtn.co.za",
  "myconnect.mtn.co.za", "portal.mtn.co.za", "business.mtn.co.za", "api.mtn.co.za"
];

// Vodacom-specific zero-rated
const VODACOM_DOMAINS = [
  "vodacom.co.za", "www.vodacom.co.za", "selfservice.vodacom.co.za",
  "vodapay.vodacom.co.za", "connectu.vodacom.co.za", "careers24.com",
  "pnet.co.za", "careerjunction.co.za", "jobmail.co.za", "indeed.com",
  "giraffe.co.za"
];

// Cell C-specific zero-rated
const CELLC_DOMAINS = [
  "cellc.co.za", "www.cellc.co.za", "gov.za", "www.gov.za", "health.gov.za",
  "education.gov.za", "sassa.gov.za", "dha.gov.za", "transport.gov.za",
  "saps.gov.za", "sadag.org", "lifelinesa.co.za", "nspca.co.za", "childwelfare.org.za"
];

// Telkom-specific zero-rated
const TELKOM_DOMAINS = [
  "telkom.co.za", "www.telkom.co.za", "sanews.gov.za", "vukuzenzele.gov.za"
];

// Rain-specific zero-rated
const RAIN_DOMAINS = [
  "rain.co.za", "www.rain.co.za", "raingo.co.za"
];

// Moya.app (zero-rated on multiple networks)
const MOYA_DOMAINS = [
  "moya.app", "faqs.moya.app", "api.moya.app", "chat.moya.app",
  "app.moya.app", "www.moya.app", "m.moya.app", "static.moya.app",
  "cdn.moya.app", "media.moya.app", "assets.moya.app", "img.moya.app",
  "files.moya.app", "s3.moya.app", "push.moya.app", "ws.moya.app",
  "wss.moya.app", "auth.moya.app", "login.moya.app", "signup.moya.app",
  "account.moya.app", "portal.moya.app", "web.moya.app", "biz.moya.app",
  "business.moya.app", "news.moya.app", "moyanews.moya.app", "api2.moya.app",
  "gateway.moya.app", "backend.moya.app", "prod.moya.app", "staging.moya.app",
  "dev.moya.app", "test.moya.app"
];

// Government zero-rated (often on Cell C and Telkom)
const GOV_ZERO_RATED = [
  "gov.za", "www.gov.za", "sacoronavirus.co.za", "health.gov.za",
  "education.gov.za", "dbe.gov.za", "sassa.gov.za", "ssa.gov.za", "dsd.gov.za",
  "dhet.gov.za", "umalusi.org.za", "nsfas.org.za", "dha.gov.za",
  "transport.gov.za", "saps.gov.za", "sanews.gov.za", "vukuzenzele.gov.za"
];

// University/TVET zero-rated (multiple networks)
const EDU_ZERO_RATED = [
  "unisa.ac.za", "ukzn.ac.za", "wits.ac.za", "uct.ac.za", "www.uct.ac.za",
  "up.ac.za", "univen.ac.za", "uwc.ac.za", "nmu.ac.za", "cut.ac.za", "dut.ac.za",
  "spu.ac.za", "ump.ac.za", "uz.ac.zw", "ru.ac.za", "sun.ac.za", "ufh.ac.za",
  "vut.ac.za", "cput.ac.za", "tut.ac.za", "mut.ac.za", "wsu.ac.za", "ul.ac.za",
  "nwu.ac.za", "unizulu.ac.za", "uj.ac.za", "www.uj.ac.za", "ulink.uj.ac.za",
  "registration.uj.ac.za", "student.uj.ac.za", "ujlink.uj.ac.za",
  "open.uct.ac.za", "sabceducation.co.za", "saben.edu.za", "ienabler.co.za",
  "moodle.dut.ac.za", "blackboard.cput.ac.za", "dbe.gov.za", "tvetcolleges.co.za",
  "careerschoice.co.za", "kznfunda.kzndoe.gov.za", "eccurriculum.co.za",
  "eceducation.gov.za"
];

// News & other zero-rated
const MISC_ZERO_RATED = [
  "sabcnews.com", "ewn.co.za", "dailymaverick.co.za", "news24.com",
  "timeslive.co.za", "careers24.com", "www.careers24.com", "careersportal.co.za",
  "www.careersportal.co.za", "ncap.co.za", "covid19.who.int", "www.who.int",
  "stg.deserve.com", "sacoronavirus.co.za", "www.departmentofeducation.co.za",
  "www.communityneedles.com", "s2sacademy.co.za", "sadag.org", "lifelinesa.co.za",
  "nspca.co.za", "childwelfare.org.za"
];

// Combined all SA domains
const ALL_SA_DOMAINS = [
  ...MOYA_DOMAINS,
  ...MTN_DOMAINS,
  ...VODACOM_DOMAINS,
  ...CELLC_DOMAINS,
  ...TELKOM_DOMAINS,
  ...RAIN_DOMAINS,
  ...GOV_ZERO_RATED,
  ...EDU_ZERO_RATED,
  ...MISC_ZERO_RATED
];

// Preset groups with network-specific options
const PRESET_GROUPS = {
  "🔴 MTN Zero-Rated": MTN_DOMAINS,
  "🔵 Vodacom Zero-Rated": VODACOM_DOMAINS,
  "🟡 Cell C Zero-Rated": CELLC_DOMAINS,
  "🟢 Telkom Zero-Rated": TELKOM_DOMAINS,
  "🌧️ Rain Zero-Rated": RAIN_DOMAINS,
  "🟣 Moya.app (all)": MOYA_DOMAINS,
  "🏛 Government": GOV_ZERO_RATED,
  "🎓 Universities/TVET": EDU_ZERO_RATED,
  "📰 News & Other": MISC_ZERO_RATED,
  "🇿🇦 All SA Domains": ALL_SA_DOMAINS,
};

const PORT_PROFILES = {
  web:   "80,443,8080,8443",
  proxy: "3128,8888,9090,1080,8118",
  admin: "8000,8001,8888,9000",
  all:   "80,443,8080,3128,8888,9090,1080,8000,8001,9000",
};
const PORT_RISK = {
  80:2, 443:2, 8080:3, 8443:2, 3128:8, 8888:8, 9090:7, 1080:7, 8118:7,
  8000:6, 8001:6, 9000:6,
};
const PORT_LABELS = {
  3128:"SQUID", 8888:"PROXY", 9090:"PROXY", 1080:"SOCKS", 8118:"PRIVOXY",
  8080:"HTTP-ALT", 8000:"ADMIN", 9000:"ADMIN",
};
const FLAGS = {
  "South Africa":"🇿🇦", "United States":"🇺🇸", "Germany":"🇩🇪",
  "Netherlands":"🇳🇱", "France":"🇫🇷", "United Kingdom":"🇬🇧",
  "Russia":"🇷🇺", "China":"🇨🇳", "Singapore":"🇸🇬",
};

// ==================== Subcomponents ====================
function RiskBadge({ port }) { 
  const risk = PORT_RISK[port]||2; 
  const label = PORT_LABELS[port]||String(port); 
  const cls = risk>=7?"bg-red-500/20 text-red-300 border-red-500/40":risk>=5?"bg-orange-500/20 text-orange-300 border-orange-500/40":"bg-cyan-500/10 text-cyan-300 border-cyan-500/30"; 
  return <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${cls}`}>{label}</span>; 
}

function ScoreDot({ score, max=30 }) { 
  const pct = Math.min(100,Math.round((score/max)*100)); 
  const color = pct>=70?"from-red-500 to-orange-500":pct>=40?"from-yellow-400 to-amber-500":"from-cyan-500 to-green-400"; 
  return (<div className="flex items-center gap-1.5"><div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${color}`} style={{width:`${pct}%`}}/></div><span className="text-[10px] font-mono text-cyan-400">{score}</span></div>); 
}

function Chip({ children, color="gray", glow=false }) { 
  const c = {
    green: `bg-green-500/20 text-green-300 border-green-500/40 ${glow?"shadow-[0_0_8px_#00ff00]":""}`,
    red:   `bg-red-500/20 text-red-300 border-red-500/40 ${glow?"shadow-[0_0_8px_#ff3333]":""}`,
    orange:"bg-orange-500/20 text-orange-300 border-orange-500/30",
    cyan:  `bg-cyan-500/20 text-cyan-300 border-cyan-500/40 ${glow?"shadow-[0_0_8px_#00ffff]":""}`,
    purple:"bg-purple-500/20 text-purple-300 border-purple-500/30",
    gray:  "bg-white/8 text-white/50 border-white/15",
  }[color]; 
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${c}`}>{children}</span>; 
}

function StatCard({ label, value, color="cyan", icon, sub }) { 
  const cols = {
    red:    "text-red-400 border-red-500/20 bg-red-500/5",
    orange: "text-orange-400 border-orange-500/20 bg-orange-500/5",
    cyan:   "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    green:  "text-green-400 border-green-500/20 bg-green-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
  }; 
  return (<div className={`border rounded-xl p-4 backdrop-blur-sm ${cols[color]}`}><div className="text-2xl font-bold font-mono">{icon} {value}</div><div className="text-xs text-cyan-400/60 mt-1">{label}</div>{sub && <div className="text-[10px] text-white/20 mt-0.5">{sub}</div>}</div>); 
}

function ProgressBar({ pct, color="cyan" }) { 
  const c = color==="green"?"from-green-500 to-emerald-400":"from-cyan-500 to-blue-500"; 
  return (<div className="w-full h-0.5 bg-cyan-500/10"><div className={`h-full bg-gradient-to-r ${c} transition-all duration-500`} style={{width:`${pct}%`}}/></div>); 
}

function SkeletonRow() { 
  return (<tr className="animate-pulse"><td className="pl-3 py-2.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500/20"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/20 rounded w-12"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/20 rounded w-32"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/20 rounded w-20"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/20 rounded w-16"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/20 rounded w-10"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/20 rounded w-24"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/20 rounded w-10"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/20 rounded w-8"/></td><td className="px-2 py-2.5"><div className="w-3 h-3 bg-cyan-500/20 rounded"/></td></tr>); 
}

// ==================== Main Component ====================
export default function Scanner() {
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const [splashStage, setSplashStage] = useState(0);
  const [splashComplete, setSplashComplete] = useState(false);
  
  const [stats, setStats] = useState({ sniScans: 0, reconScans: 0, proxiesFound: 0, lastScan: null });
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
  const [sniSortField, setSniSortField] = useState("");
  const [sniSortAsc, setSniSortAsc] = useState(true);
  
  const [reconDomains, setReconDomains] = useState("accenture.com\nmtn.co.za\nvodacom.co.za");
  const [reconProfile, setReconProfile] = useState("all");
  const [reconStatus, setReconStatus] = useState("idle");
  const [reconResults, setReconResults] = useState([]);
  const [reconProgress, setReconProgress] = useState(0);
  const [reconError, setReconError] = useState("");
  const [reconFilter, setReconFilter] = useState("");
  const [showHighlights, setShowHighlights] = useState(false);
  const [reconSortField, setReconSortField] = useState("score");
  const [reconSortAsc, setReconSortAsc] = useState(false);
  
  const [proxyHost, setProxyHost] = useState("");
  const [proxyPort, setProxyPort] = useState("3128,8888,9090,1080,8118");
  const [proxyTarget, setProxyTarget] = useState("https://httpbin.org/ip");
  const [proxyResult, setProxyResult] = useState(null);
  const [proxyLoading, setProxyLoading] = useState(false);
  
  const [sslDomain, setSslDomain] = useState("");
  const [sslResult, setSslResult] = useState(null);
  const [sslLoading, setSslLoading] = useState(false);
  
  const SUBDOMAINS = ['www','mail','api','vpn','admin','portal'];
  
  useEffect(() => { setMounted(true); }, []);
  
  // Splash screen timer
  useEffect(() => {
    if (!mounted || splashComplete) return;
    if (splashStage < SPLASH_STAGES.length) {
      const timer = setTimeout(() => setSplashStage(prev => prev + 1), SPLASH_STAGES[splashStage].duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setSplashComplete(true), 500);
      return () => clearTimeout(timer);
    }
  }, [splashStage, mounted, splashComplete]);
  
  useEffect(() => {
    const saved = localStorage.getItem('scanner_stats');
    if (saved) setStats(JSON.parse(saved));
  }, []);
  
  const updateStats = (type, extra = {}) => {
    setStats(prev => {
      const updated = {
        sniScans: prev.sniScans + (type === 'sni' ? 1 : 0),
        reconScans: prev.reconScans + (type === 'recon' ? 1 : 0),
        proxiesFound: prev.proxiesFound + (extra.proxies || 0),
        lastScan: new Date().toISOString()
      };
      localStorage.setItem('scanner_stats', JSON.stringify(updated));
      return updated;
    });
  };
  
  const copyToClipboard = (text, label = 'Copied!') => {
    navigator.clipboard?.writeText(text).then(() => toast.success(label)).catch(() => toast.error('Failed to copy'));
  };

  // ==================== Scan Functions ====================
  async function launchSNI() {
    setSniError(""); setSniResults([]); setSniTested(0);
    const hosts = sniCustomText.trim() ? sniCustomText.split("\n").map(s=>s.trim()).filter(Boolean) : PRESET_GROUPS[sniPreset]||ALL_SA_DOMAINS;
    setSniTotal(hosts.length); setSniStatus("running");
    toast.loading(`Scanning ${hosts.length} SNI hosts...`, { id: 'sni-scan' });
    try {
      const r = await fetch('/api/sniScan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sni_hosts:hosts,target_ip:sniTargetIP||null,port:parseInt(sniPort)||443,probe_http:sniProbeHTTP,probe_geo:sniProbeGeo})});
      const d = await r.json();
      if(d.error){ setSniError(d.error); setSniStatus("error"); toast.error(d.error, { id: 'sni-scan' }); }
      else { setSniResults(d.results); setSniStatus("done"); setSniTested(d.tested); toast.success(`Found ${d.results.length} working SNIs`, { id: 'sni-scan' }); updateStats('sni'); }
    } catch(e){ setSniError(e.message); setSniStatus("error"); toast.error(e.message, { id: 'sni-scan' }); }
  }

  async function launchRecon() {
    setReconError(""); setReconResults([]); setReconProgress(0);
    const domains = reconDomains.split("\n").map(s=>s.trim()).filter(Boolean);
    if(!domains.length){ setReconError("Enter at least one domain."); toast.error("Enter at least one domain."); return; }
    setReconStatus("running"); setReconProgress(5);
    toast.loading(`Scanning ${domains.length} domains...`, { id: 'recon-scan' });
    const all = []; const concurrency=3; const chunks=[];
    for(let i=0;i<domains.length;i+=concurrency) chunks.push(domains.slice(i,i+concurrency));
    try {
      for(const c of chunks) {
        await Promise.all(c.map(async d=>{
          try {
            const r = await fetch('/api/reconSingle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:d,profile:reconProfile})});
            const data = await r.json();
            if(data.results) all.push(...data.results);
            setReconResults([...all]);
          } catch(err){ console.error(err); }
        }));
        setReconProgress(Math.min(95,5+(all.length/(domains.length*(SUBDOMAINS.length+1)))*90));
      }
      const proxyCount = all.filter(r=>r.proxy_ok).length;
      setReconStatus("done"); setReconProgress(100);
      toast.success(`Recon complete – ${all.length} live hosts, ${proxyCount} proxies`, { id: 'recon-scan' });
      updateStats('recon', { proxies: proxyCount });
    } catch(e){ setReconError(e.message); setReconStatus("error"); toast.error(e.message, { id: 'recon-scan' }); }
  }

  async function testProxy() {
    if(!proxyHost){ toast.error("Host required"); return; }
    const ports = proxyPort.trim()?proxyPort.split(',').map(p=>parseInt(p.trim())).filter(p=>!isNaN(p)):[3128,8888,9090,1080,8118];
    setProxyLoading(true); setProxyResult(null);
    toast.loading(`Testing ${ports.length} ports...`, { id: 'proxy-test' });
    try {
      const r = await fetch('/api/proxyTest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({proxyHost,ports,targetUrl:proxyTarget})});
      const d = await r.json(); setProxyResult(d);
      const working = d.results?.filter(p=>p.success).length || 0;
      if (working > 0) toast.success(`${working} port(s) responsive`, { id: 'proxy-test' });
      else toast.error('No responsive ports', { id: 'proxy-test' });
    } catch(e){ setProxyResult({error:e.message}); toast.error(e.message, { id: 'proxy-test' }); }
    finally { setProxyLoading(false); }
  }

  async function scanSSL() {
    if(!sslDomain.trim()){ toast.error("Please enter a domain"); return; }
    setSslLoading(true); setSslResult(null);
    toast.loading(`Scanning SSL for ${sslDomain}...`, { id: 'ssl-scan' });
    try {
      const r = await fetch('/api/sslScan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:sslDomain.trim()})});
      const d = await r.json();
      setSslResult(d);
      if (d.success) toast.success(`Certificate valid until ${d.validTo}`, { id: 'ssl-scan' });
      else toast.error(d.error || "SSL scan failed", { id: 'ssl-scan' });
    } catch(e){ setSslResult({error:e.message}); toast.error(e.message, { id: 'ssl-scan' }); }
    finally { setSslLoading(false); }
  }

  // ==================== Sorting ====================
  const sniDisplayed = useMemo(() => {
    let filtered = sniResults.filter(r=>!sniFilter||r.sni.includes(sniFilter)||(r.geo?.country||"").toLowerCase().includes(sniFilter.toLowerCase()));
    if (sniSortField) {
      filtered.sort((a,b) => {
        let valA = a[sniSortField] || '';
        let valB = b[sniSortField] || '';
        if (sniSortField === 'http') { valA = a.http?.status || 0; valB = b.http?.status || 0; }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sniSortAsc ? -1 : 1;
        if (valA > valB) return sniSortAsc ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [sniResults, sniFilter, sniSortField, sniSortAsc]);
  
  const reconLive = reconResults.filter(r=>r.ips?.length);
  const reconDisplayed = useMemo(() => {
    let filtered = reconLive.filter(r=>{
      if (showHighlights&&!r.highlight) return false;
      if (!reconFilter) return true;
      const q = reconFilter.toLowerCase();
      return r.domain.includes(q)||(r.ips||[]).join("").includes(q)||(r.http?.title||"").toLowerCase().includes(q)||(r.geo?.country||"").toLowerCase().includes(q);
    });
    if (reconSortField) {
      filtered.sort((a,b) => {
        let valA = a[reconSortField] || '';
        let valB = b[reconSortField] || '';
        if (reconSortField === 'http') { valA = a.http?.status || 0; valB = b.http?.status || 0; }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return reconSortAsc ? -1 : 1;
        if (valA > valB) return reconSortAsc ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [reconLive, reconFilter, showHighlights, reconSortField, reconSortAsc]);
  
  const scanning = sniStatus === "running" || reconStatus === "running";

  const SortableHeader = ({ field, children, currentField, setField, asc, setAsc }) => (
    <th className="px-3 py-2 text-left cursor-pointer hover:text-cyan-400 transition" onClick={() => { if (currentField === field) setAsc(!asc); else { setField(field); setAsc(true); } }}>
      <div className="flex items-center gap-1">
        {children}
        {currentField === field && (asc ? <FiChevronUp size={12} className="text-cyan-400"/> : <FiChevronDown size={12} className="text-cyan-400"/>)}
      </div>
    </th>
  );

  // Splash Screen Render
  if (!splashComplete) {
    const stage = SPLASH_STAGES[splashStage] || SPLASH_STAGES[SPLASH_STAGES.length - 1];
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-black font-mono relative"
        style={{
          backgroundImage: `url('${stage.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-md px-6">
          <div className="text-cyan-400 text-sm mb-4 tracking-widest animate-pulse">
            {stage.text}
          </div>
          {stage.subtext && (
            <div className="text-green-400 text-xs mb-6 whitespace-pre-line leading-relaxed">
              {stage.subtext}
            </div>
          )}
          {stage.progress !== undefined && (
            <div className="w-full h-1.5 bg-cyan-500/20 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-300"
                style={{ width: `${stage.progress}%` }}
              />
              <div className="text-right text-cyan-400 text-[10px] mt-0.5">{stage.progress}%</div>
            </div>
          )}
          <div className="text-cyan-500/40 text-[10px] tracking-widest">
            BruteforceScannerR
          </div>
        </div>
      </div>
    );
  }

  // Main App Render
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <title>Bruteforce Recon</title>
      </Head>
      <div 
        className="min-h-screen text-white font-mono text-sm relative"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="border-b border-cyan-500/20 bg-black/60 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="font-mono text-xs leading-tight border border-cyan-500/30 bg-black/60 px-3 py-1.5 rounded">
                <div className="text-cyan-400">ENTER PASSWORD: <span className="text-green-400">*****</span></div>
                <div className="text-red-500">ACCESS GRANTED</div>
                <div className="text-white font-bold tracking-wider text-sm mt-0.5">BruteforceScannerR</div>
              </div>
              <div className="hidden md:block">
                <div className="font-black text-base tracking-wider text-cyan-400">BRUTEFORCE</div>
                <div className="text-[9px] text-cyan-500/50 tracking-widest uppercase">Recon Framework v2</div>
              </div>
              {scanning && (
                <div className="flex items-center gap-2 ml-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"/>
                  <span className="text-xs text-cyan-400 font-mono tracking-widest">LIVE</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div className="hidden md:flex gap-1">
                {[["dashboard","📊 Dashboard"],["sni","📡 SNI"],["recon","🔍 Recon"],["proxy","🧪 Proxy"],["ssl","🔒 SSL"]].map(([t,l])=>(
                  <button key={t} onClick={()=>setTab(t)} className={`px-4 py-1.5 rounded-lg text-xs tracking-wider transition-all ${tab===t?"bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg":"text-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5"}`}>{l}</button>
                ))}
              </div>
              <div className="md:hidden">
                <select value={tab} onChange={e=>setTab(e.target.value)} className="bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs text-cyan-400 focus:outline-none">
                  <option value="dashboard">📊 Dashboard</option>
                  <option value="sni">📡 SNI</option>
                  <option value="recon">🔍 Recon</option>
                  <option value="proxy">🧪 Proxy</option>
                  <option value="ssl">🔒 SSL</option>
                </select>
              </div>
              <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="ml-2 p-2 rounded-lg bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400/60 hover:text-cyan-400 transition">
                {theme==='dark'?<FiSun size={16}/>:<FiMoon size={16}/>}
              </button>
            </div>
          </div>

          {scanning && <ProgressBar pct={tab==="sni"?(sniResults.length/Math.max(1,sniTotal)*100):reconProgress} color="cyan"/>}

          <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 space-y-5">
            
            {/* Dashboard Tab */}
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="SNI Scans" value={stats.sniScans} color="cyan" icon={<FiShield/>}/>
                  <StatCard label="Recon Scans" value={stats.reconScans} color="purple" icon={<FiGlobe/>}/>
                  <StatCard label="Proxies Found" value={stats.proxiesFound} color="green" icon={<FiZap/>}/>
                  <StatCard label="Last Scan" value={stats.lastScan ? new Date(stats.lastScan).toLocaleDateString() : "—"} color="yellow" icon={<FiActivity/>}/>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2"><FiZap className="text-cyan-400"/> Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={()=>setTab("sni")} className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-left hover:border-cyan-500/40 transition">
                        <div className="text-cyan-400 text-xl mb-1"><FiShield/></div>
                        <div className="font-bold text-sm text-white">SNI Scanner</div>
                        <div className="text-[10px] text-cyan-400/60">Bulk SNI handshake test</div>
                      </button>
                      <button onClick={()=>setTab("recon")} className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl text-left hover:border-purple-500/40 transition">
                        <div className="text-purple-400 text-xl mb-1"><FiGlobe/></div>
                        <div className="font-bold text-sm text-white">Recon</div>
                        <div className="text-[10px] text-purple-400/60">Subdomain + port scan</div>
                      </button>
                      <button onClick={()=>setTab("proxy")} className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl text-left hover:border-green-500/40 transition">
                        <div className="text-green-400 text-xl mb-1"><FiZap/></div>
                        <div className="font-bold text-sm text-white">Proxy Tester</div>
                        <div className="text-[10px] text-green-400/60">Validate open proxies</div>
                      </button>
                      <button onClick={()=>setTab("ssl")} className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-left hover:border-red-500/40 transition">
                        <div className="text-red-400 text-xl mb-1"><FiActivity/></div>
                        <div className="font-bold text-sm text-white">SSL Scanner</div>
                        <div className="text-[10px] text-red-400/60">Certificate inspection</div>
                      </button>
                    </div>
                  </div>
                  <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-cyan-400 mb-3">Recent Activity</h3>
                    {reconDisplayed.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {reconDisplayed.slice(0,5).map((r,i)=>(
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${r.proxy_ok?'bg-green-400':r.highlight?'bg-red-400':'bg-cyan-400'}`}/>
                              <span className="text-xs font-mono text-cyan-300 truncate max-w-[150px]">{r.domain}</span>
                            </div>
                            <div className="flex gap-1">
                              {r.open_ports?.slice(0,3).map(p=><RiskBadge key={p} port={p}/>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-cyan-500/30 text-xs">Run a Recon scan to see results</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SNI Tab */}
            {tab === "sni" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-3">
                    <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                      <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-3">Domain Preset</div>
                      <div className="flex flex-wrap gap-1.5 mb-4 max-h-40 overflow-y-auto">
                        {Object.entries(PRESET_GROUPS).map(([name,domains])=>(
                          <button key={name} onClick={()=>{setSniPreset(name);setSniCustomText("");}} className={`px-3 py-1.5 rounded-lg text-xs transition ${sniPreset===name&&!sniCustomText?"bg-cyan-500/20 text-cyan-300 border border-cyan-500/40":"bg-cyan-500/5 text-cyan-400/60 border border-cyan-500/20 hover:bg-cyan-500/10"}`}>
                            {name} <span className="text-cyan-400/40 ml-1">({domains.length})</span>
                          </button>
                        ))}
                      </div>
                      {!sniCustomText && (
                        <div className="bg-black/60 border border-cyan-500/20 rounded-xl p-3 max-h-32 overflow-y-auto mb-4">
                          <div className="text-[9px] text-cyan-400/40 mb-2">{(PRESET_GROUPS[sniPreset]||[]).length} hosts loaded</div>
                          <div className="flex flex-wrap gap-1">{(PRESET_GROUPS[sniPreset]||[]).map(d=><span key={d} className="text-[10px] font-mono text-cyan-400/60 bg-cyan-500/10 px-1.5 py-0.5 rounded">{d}</span>)}</div>
                        </div>
                      )}
                      <div className="mb-4">
                        <div className="text-[10px] text-cyan-400/60 uppercase mb-1.5">Or paste custom list</div>
                        <textarea value={sniCustomText} onChange={e=>setSniCustomText(e.target.value)} rows={3} placeholder={"moya.app\nnofunds.mtn.co.za\n..."} className="w-full bg-black/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-xs font-mono text-cyan-300 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-500/60 resize-none"/>
                      </div>
                      <button onClick={launchSNI} disabled={sniStatus==="running"} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider text-sm transition disabled:opacity-30 shadow-[0_0_20px_#00ffff40]">{sniStatus==="running"?"⟳ TESTING SNIs...":"▶ BRUTEFORCE SNI"}</button>
                      {sniError && <div className="text-xs text-red-400 mt-2">{sniError}</div>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                      <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-3">Options</div>
                      <div className="space-y-3">
                        <div><label className="text-[10px] text-cyan-400/60 block mb-1">Target IP (optional)</label><input value={sniTargetIP} onChange={e=>setSniTargetIP(e.target.value)} placeholder="Auto-resolve" className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-300 focus:border-cyan-500/60"/></div>
                        <div><label className="text-[10px] text-cyan-400/60 block mb-1">Port</label><input value={sniPort} onChange={e=>setSniPort(e.target.value)} className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-300"/></div>
                        <div className="space-y-2">
                          {[[sniProbeHTTP,setSniProbeHTTP,"HTTP banner"],[sniProbeGeo,setSniProbeGeo,"GeoIP lookup"]].map(([val,set,label],i)=>(<label key={i} className="flex items-center gap-2 cursor-pointer"><div onClick={()=>set(v=>!v)} className={`w-8 h-4 rounded-full transition relative ${val?"bg-cyan-500/40 border-cyan-500/60":"bg-cyan-500/10 border-cyan-500/20"}`}><div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${val?"left-4 bg-cyan-400":"left-0.5 bg-cyan-500/30"}`}/></div><span className="text-xs text-cyan-400/60">{label}</span></label>))}
                        </div>
                      </div>
                    </div>
                    {sniStatus!=="idle"&&(
                      <div className="space-y-2">
                        <StatCard label="Working SNIs" value={sniResults.length} color="cyan" icon="✓"/>
                        <StatCard label="IPs Tested" value={[...new Set(sniResults.map(r=>r.ip))].length} color="cyan" icon="🌐"/>
                      </div>
                    )}
                  </div>
                </div>
                {sniDisplayed.length>0&&(
                  <div className="bg-black/40 border border-cyan-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="px-4 py-3 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-mono text-sm font-bold">{sniDisplayed.length} WORKING SNI HOSTS</span>
                        <input value={sniFilter} onChange={e=>setSniFilter(e.target.value)} placeholder="filter..." className="bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-1 text-xs text-cyan-300 w-40"/>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-xs text-cyan-400 transition">⬇ CSV</button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-[9px] text-cyan-400/60 uppercase tracking-widest border-b border-cyan-500/20">
                            <th className="w-4 pl-4"/>
                            <SortableHeader field="sni" currentField={sniSortField} setField={setSniSortField} asc={sniSortAsc} setAsc={setSniSortAsc}>SNI Host</SortableHeader>
                            <th className="px-3 py-2 text-left">IP:Port</th>
                            <SortableHeader field="http" currentField={sniSortField} setField={setSniSortField} asc={sniSortAsc} setAsc={setSniSortAsc}>Status</SortableHeader>
                            <th className="px-3 py-2 text-left">Title</th>
                            <th className="px-3 py-2 text-left">Country</th>
                            <th className="px-3 py-2 text-left">Time</th>
                            <th className="px-3 py-2 text-left">Result</th>
                            <th className="w-4"/>
                          </tr>
                        </thead>
                        <tbody>
                          {sniStatus==="running" && sniResults.length===0 ? Array.from({length:5}).map((_,i)=><SkeletonRow key={i}/>) : 
                            sniDisplayed.map((r,i)=>(
                              <tr key={r.sni+i} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition text-xs group">
                                <td className="pl-4 py-2.5"><div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#00ff00]"/></td>
                                <td className="px-3 py-2.5 font-mono text-cyan-300 flex items-center gap-2">
                                  <span className="truncate max-w-[150px]">{r.sni}</span>
                                  <button onClick={()=>copyToClipboard(r.sni, 'SNI copied')} className="opacity-0 group-hover:opacity-100 transition"><FiCopy size={12} className="text-cyan-400/60 hover:text-cyan-400"/></button>
                                </td>
                                <td className="px-3 py-2.5 font-mono text-cyan-400/60">{r.ip}:{r.port}</td>
                                <td className="px-3 py-2.5">{r.http?.status?<span className={r.http.status<300?"text-green-400":"text-yellow-400"}>{r.http.status}</span>:"—"}</td>
                                <td className="px-3 py-2.5 text-cyan-400/60 max-w-[160px] truncate">{r.http?.title||"—"}</td>
                                <td className="px-3 py-2.5 text-cyan-400/60">{FLAGS[r.geo?.country]||"🌍"} {r.geo?.country||"—"}</td>
                                <td className="px-3 py-2.5 font-mono text-cyan-400/40 text-[10px]">{new Date(r.timestamp).toLocaleTimeString()}</td>
                                <td className="px-3 py-2.5"><Chip color="green" glow>✓ SNI OK</Chip></td>
                                <td className="px-2 py-2.5"/>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Recon Tab */}
            {tab === "recon" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                    <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-3">Target Domains</div>
                    <textarea value={reconDomains} onChange={e=>setReconDomains(e.target.value)} rows={4} placeholder="mtn.co.za&#10;vodacom.co.za&#10;moya.app" className="w-full bg-black/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-xs font-mono text-cyan-300 placeholder-cyan-500/30 focus:border-cyan-500/60 resize-none mb-4"/>
                    <button onClick={launchRecon} disabled={reconStatus==="running"} className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-wider text-sm transition disabled:opacity-30 shadow-[0_0_20px_#a855f740]">{reconStatus==="running"?"⟳ SCANNING...":"▶ LAUNCH RECON"}</button>
                    {reconError && <div className="text-xs text-red-400 mt-2">{reconError}</div>}
                  </div>
                  <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                    <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-3">Port Profile</div>
                    <div className="grid grid-cols-2 gap-2 mb-3">{Object.keys(PORT_PROFILES).map(k=>(<button key={k} onClick={()=>setReconProfile(k)} className={`py-2 rounded-lg text-xs uppercase transition ${reconProfile===k?"bg-cyan-500/20 text-cyan-300 border border-cyan-500/40":"bg-cyan-500/5 text-cyan-400/60 border border-cyan-500/20 hover:bg-cyan-500/10"}`}>{k}</button>))}</div>
                    <div className="text-[10px] text-cyan-400/40 font-mono">{PORT_PROFILES[reconProfile]}</div>
                  </div>
                </div>
                {reconLive.length>0&&(<div className="grid grid-cols-2 sm:grid-cols-5 gap-3"><StatCard label="Live" value={reconLive.length} color="cyan"/><StatCard label="Highlights" value={reconLive.filter(r=>r.highlight).length} color="red"/><StatCard label="Proxies" value={reconLive.filter(r=>r.proxy_ok).length} color="green"/><StatCard label="Titled" value={reconLive.filter(r=>r.http?.title).length} color="purple"/><StatCard label="GeoMapped" value={reconLive.filter(r=>r.geo?.country).length} color="cyan"/></div>)}
                {reconDisplayed.length>0&&(
                  <div className="bg-black/40 border border-cyan-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="px-4 py-3 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input value={reconFilter} onChange={e=>setReconFilter(e.target.value)} placeholder="filter results..." className="bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-1 text-xs text-cyan-300 w-48"/>
                        <button onClick={()=>setShowHighlights(v=>!v)} className={`px-3 py-1 rounded-lg text-xs transition ${showHighlights?"bg-red-500/20 text-red-300 border-red-500/40":"bg-cyan-500/5 text-cyan-400/60 border border-cyan-500/20"}`}>🔴 Highlights</button>
                      </div>
                      <button className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-xs text-cyan-400">⬇ CSV</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-[9px] text-cyan-400/60 uppercase tracking-widest border-b border-cyan-500/20">
                            <th className="w-3 pl-3"/>
                            <SortableHeader field="score" currentField={reconSortField} setField={setReconSortField} asc={reconSortAsc} setAsc={setReconSortAsc}>Score</SortableHeader>
                            <SortableHeader field="domain" currentField={reconSortField} setField={setReconSortField} asc={reconSortAsc} setAsc={setReconSortAsc}>Domain</SortableHeader>
                            <th className="px-3 py-2 text-left">IP</th>
                            <th className="px-3 py-2 text-left">Ports</th>
                            <th className="px-3 py-2 text-left">Proxy</th>
                            <th className="px-3 py-2 text-left">Title</th>
                            <th className="px-3 py-2 text-left">Geo</th>
                            <th className="px-3 py-2 text-left">HTTP</th>
                            <th className="w-4"/>
                          </tr>
                        </thead>
                        <tbody>
                          {reconStatus==="running" && reconResults.length===0 ? Array.from({length:3}).map((_,i)=><SkeletonRow key={i}/>) :
                            reconDisplayed.map((r,i)=>(
                              <tr key={r.domain+i} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition text-xs group">
                                <td className="pl-3 py-2.5"><div className={`w-1.5 h-1.5 rounded-full ${r.highlight?"bg-red-400 shadow-[0_0_6px_#ff3333]":"bg-cyan-400/40"}`}/></td>
                                <td className="px-3 py-2.5"><ScoreDot score={r.score}/></td>
                                <td className="px-3 py-2.5 font-mono text-cyan-300 flex items-center gap-2">
                                  <span className="truncate max-w-[150px]">{r.domain}</span>
                                  <button onClick={()=>copyToClipboard(r.domain, 'Domain copied')} className="opacity-0 group-hover:opacity-100 transition"><FiCopy size={12} className="text-cyan-400/60 hover:text-cyan-400"/></button>
                                </td>
                                <td className="px-3 py-2.5 font-mono text-cyan-400/60">{(r.ips||[])[0]||"—"}</td>
                                <td className="px-3 py-2.5"><div className="flex gap-1 flex-wrap">{(r.open_ports||[]).map(p=><RiskBadge key={p} port={p}/>)}</div></td>
                                <td className="px-3 py-2.5">{r.proxy_ok?<Chip color="green" glow>⚡ PROXY</Chip>:<span className="text-cyan-400/20">—</span>}</td>
                                <td className="px-3 py-2.5 text-cyan-400/60 max-w-[160px] truncate">{r.http?.title||"—"}</td>
                                <td className="px-3 py-2.5 text-cyan-400/60">{FLAGS[r.geo?.country]||"🌍"} {r.geo?.city||r.geo?.country||"—"}</td>
                                <td className="px-3 py-2.5">{r.http?.status?<span className={r.http.status<300?"text-green-400":"text-yellow-400"}>{r.http.status}</span>:"—"}</td>
                                <td className="px-2"/>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Proxy Tab */}
            {tab === "proxy" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-3">Proxy Tester (Multi‑Port)</div>
                  <div className="space-y-3">
                    <div><label className="text-[10px] text-cyan-400/60 block mb-1">Proxy Host</label><input value={proxyHost} onChange={e=>setProxyHost(e.target.value)} placeholder="e.g., api.vodacom.co.za" className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-300"/></div>
                    <div><label className="text-[10px] text-cyan-400/60 block mb-1">Ports (comma‑separated)</label><input value={proxyPort} onChange={e=>setProxyPort(e.target.value)} placeholder="3128,8888,9090,1080,8118" className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-300"/></div>
                    <div><label className="text-[10px] text-cyan-400/60 block mb-1">Target URL</label><input value={proxyTarget} onChange={e=>setProxyTarget(e.target.value)} className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-300"/></div>
                    <button onClick={testProxy} disabled={proxyLoading} className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold tracking-wider text-sm transition disabled:opacity-30 shadow-[0_0_20px_#10b98140]">{proxyLoading?"TESTING...":"▶ TEST ALL PORTS"}</button>
                  </div>
                  {proxyResult&&(<div className="mt-4 space-y-2 max-h-80 overflow-y-auto"><div className="text-xs text-cyan-400/60">Results for {proxyResult.host}:</div>{proxyResult.results?.map((r,i)=>(<div key={i} className={`p-3 rounded-lg border ${r.success?'bg-green-500/10 border-green-500/30':'bg-red-500/10 border-red-500/30'}`}><div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${r.success?'bg-green-400':'bg-red-400'}`}/><span className="text-xs font-mono text-cyan-300">Port {r.port}</span>{r.status&&<span className="text-[10px] text-cyan-400/40">({r.status})</span>}</div>{r.success&&r.data?<pre className="text-green-300 text-[10px] mt-1 overflow-x-auto">{JSON.stringify(r.data,null,2)}</pre>:<div className="text-[10px] text-red-300 mt-1">{r.error||'Failed'}</div>}</div>))||<div className="text-red-300">{proxyResult.error}</div>}</div>)}
                </div>
                <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-3">How to Use</div>
                  <ol className="text-xs text-cyan-400/60 space-y-2 list-decimal list-inside"><li>Enter proxy host from Recon results.</li><li>Specify ports to test.</li><li>Click "Test All Ports".</li><li className="text-yellow-400/60">⚠️ Only test on authorized networks.</li></ol>
                </div>
              </div>
            )}

            {/* SSL Tab */}
            {tab === "ssl" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-3">SSL Certificate Scanner</div>
                  <div className="space-y-3">
                    <div><label className="text-[10px] text-cyan-400/60 block mb-1">Domain</label><input value={sslDomain} onChange={e=>setSslDomain(e.target.value)} placeholder="e.g., arenaplus.co.za" className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-300"/></div>
                    <button onClick={scanSSL} disabled={sslLoading} className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold tracking-wider text-sm transition disabled:opacity-30 shadow-[0_0_20px_#ef444440]">{sslLoading?"SCANNING...":"▶ SCAN SSL"}</button>
                  </div>
                  {sslResult&&(<div className={`mt-4 p-4 rounded-xl border ${sslResult.success?'bg-green-500/10 border-green-500/30':'bg-red-500/10 border-red-500/30'}`}>{sslResult.success?<><div className="text-xs text-cyan-300"><span className="text-cyan-400/60">Domain:</span> {sslResult.domain}</div><div className="text-xs mt-1 text-cyan-300"><span className="text-cyan-400/60">Issuer:</span> {sslResult.issuer}</div><div className="text-xs mt-1 text-cyan-300"><span className="text-cyan-400/60">Subject CN:</span> {sslResult.subjectCN}</div><div className="text-xs mt-1 text-cyan-300"><span className="text-cyan-400/60">Valid:</span> {sslResult.validFrom} → {sslResult.validTo}</div>{sslResult.daysRemaining!==null&&<div className="text-xs mt-1"><span className="text-cyan-400/60">Days left:</span> <span className={sslResult.daysRemaining<30?"text-red-400":sslResult.daysRemaining<90?"text-yellow-400":"text-green-400"}>{sslResult.daysRemaining}</span></div>}</>:<div className="text-xs text-red-300">{sslResult.error}</div>}</div>)}
                </div>
                <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-3">Certificate Details</div>
                  <p className="text-xs text-cyan-400/60">Enter a domain to check its SSL certificate validity, issuer, and expiration.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
