// pages/index.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Head from 'next/head';
import toast from 'react-hot-toast';
import { FiCopy, FiMoon, FiSun, FiChevronDown, FiChevronUp, FiShield, FiGlobe, FiZap, FiActivity, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useTheme } from 'next-themes';

// ==================== CONSTANTS ====================
const SPLASH_STAGES = [
  { image: '/authorization.jpg', text: 'DECRYPTING ACCESS...', subtext: 'AUTHORIZATION', duration: 2000 },
  { image: '/breaching.jpg', text: 'BREACH IN-PROGRESS', subtext: 'BREACHING', progress: 64, duration: 2000 },
  { image: '/access-granted.jpg', text: 'ACCESS GRANTED', subtext: 'Welcome, Operator', duration: 2000 }
];

const MTN_DOMAINS = [ "mtn.co.za", "www.mtn.co.za", "nofunds.mtn.co.za", "onlinecms.mtn.co.za", "dev.onlinecms.mtn.co.za", "myaccount.mtn.co.za", "selfservice.mtn.co.za", "myconnect.mtn.co.za", "portal.mtn.co.za", "business.mtn.co.za", "api.mtn.co.za" ];
const VODACOM_DOMAINS = [ "vodacom.co.za", "www.vodacom.co.za", "selfservice.vodacom.co.za", "vodapay.vodacom.co.za", "connectu.vodacom.co.za", "careers24.com", "pnet.co.za", "careerjunction.co.za", "jobmail.co.za", "indeed.com", "giraffe.co.za" ];
const CELLC_DOMAINS = [ "cellc.co.za", "www.cellc.co.za", "gov.za", "www.gov.za", "health.gov.za", "education.gov.za", "sassa.gov.za", "dha.gov.za", "transport.gov.za", "saps.gov.za", "sadag.org", "lifelinesa.co.za", "nspca.co.za", "childwelfare.org.za" ];
const TELKOM_DOMAINS = [ "telkom.co.za", "www.telkom.co.za", "sanews.gov.za", "vukuzenzele.gov.za" ];
const RAIN_DOMAINS = [ "rain.co.za", "www.rain.co.za", "raingo.co.za" ];
const MOYA_DOMAINS = [ "moya.app", "faqs.moya.app", "api.moya.app", "chat.moya.app", "app.moya.app", "www.moya.app", "m.moya.app", "static.moya.app", "cdn.moya.app", "media.moya.app", "assets.moya.app", "img.moya.app", "files.moya.app", "s3.moya.app", "push.moya.app", "ws.moya.app", "wss.moya.app", "auth.moya.app", "login.moya.app", "signup.moya.app", "account.moya.app", "portal.moya.app", "web.moya.app", "biz.moya.app", "business.moya.app", "news.moya.app", "moyanews.moya.app", "api2.moya.app", "gateway.moya.app", "backend.moya.app", "prod.moya.app", "staging.moya.app", "dev.moya.app", "test.moya.app" ];
const GOV_ZERO_RATED = [ "gov.za", "www.gov.za", "sacoronavirus.co.za", "health.gov.za", "education.gov.za", "dbe.gov.za", "sassa.gov.za", "ssa.gov.za", "dsd.gov.za", "dhet.gov.za", "umalusi.org.za", "nsfas.org.za", "dha.gov.za", "transport.gov.za", "saps.gov.za", "sanews.gov.za", "vukuzenzele.gov.za" ];
const EDU_ZERO_RATED = [ "unisa.ac.za", "ukzn.ac.za", "wits.ac.za", "uct.ac.za", "www.uct.ac.za", "up.ac.za", "univen.ac.za", "uwc.ac.za", "nmu.ac.za", "cut.ac.za", "dut.ac.za", "spu.ac.za", "ump.ac.za", "uz.ac.zw", "ru.ac.za", "sun.ac.za", "ufh.ac.za", "vut.ac.za", "cput.ac.za", "tut.ac.za", "mut.ac.za", "wsu.ac.za", "ul.ac.za", "nwu.ac.za", "unizulu.ac.za", "uj.ac.za", "www.uj.ac.za", "ulink.uj.ac.za", "registration.uj.ac.za", "student.uj.ac.za", "ujlink.uj.ac.za", "open.uct.ac.za", "sabceducation.co.za", "saben.edu.za", "ienabler.co.za", "moodle.dut.ac.za", "blackboard.cput.ac.za", "dbe.gov.za", "tvetcolleges.co.za", "careerschoice.co.za", "kznfunda.kzndoe.gov.za", "eccurriculum.co.za", "eceducation.gov.za" ];
const MISC_ZERO_RATED = [ "sabcnews.com", "ewn.co.za", "dailymaverick.co.za", "news24.com", "timeslive.co.za", "careers24.com", "www.careers24.com", "careersportal.co.za", "www.careersportal.co.za", "ncap.co.za", "covid19.who.int", "www.who.int", "stg.deserve.com", "sacoronavirus.co.za", "www.departmentofeducation.co.za", "www.communityneedles.com", "s2sacademy.co.za", "sadag.org", "lifelinesa.co.za", "nspca.co.za", "childwelfare.org.za" ];
const ALL_SA_DOMAINS = [ ...MOYA_DOMAINS, ...MTN_DOMAINS, ...VODACOM_DOMAINS, ...CELLC_DOMAINS, ...TELKOM_DOMAINS, ...RAIN_DOMAINS, ...GOV_ZERO_RATED, ...EDU_ZERO_RATED, ...MISC_ZERO_RATED ];
const PRESET_GROUPS = {
  "🔴 MTN Zero-Rated": MTN_DOMAINS, "🔵 Vodacom Zero-Rated": VODACOM_DOMAINS, "🟡 Cell C Zero-Rated": CELLC_DOMAINS,
  "🟢 Telkom Zero-Rated": TELKOM_DOMAINS, "🌧️ Rain Zero-Rated": RAIN_DOMAINS, "🟣 Moya.app (all)": MOYA_DOMAINS,
  "🏛 Government": GOV_ZERO_RATED, "🎓 Universities/TVET": EDU_ZERO_RATED, "📰 News & Other": MISC_ZERO_RATED,
  "🇿🇦 All SA Domains": ALL_SA_DOMAINS,
};
const PORT_PROFILES = { web:"80,443,8080,8443", proxy:"3128,8888,9090,1080,8118", admin:"8000,8001,8888,9000", all:"80,443,8080,3128,8888,9090,1080,8000,8001,9000" };
const PORT_RISK = { 80:2, 443:2, 8080:3, 8443:2, 3128:8, 8888:8, 9090:7, 1080:7, 8118:7, 8000:6, 8001:6, 9000:6 };
const PORT_LABELS = { 3128:"SQUID", 8888:"PROXY", 9090:"PROXY", 1080:"SOCKS", 8118:"PRIVOXY", 8080:"HTTP-ALT", 8000:"ADMIN", 9000:"ADMIN" };
const FLAGS = { "South Africa":"🇿🇦", "United States":"🇺🇸", "Germany":"🇩🇪", "Netherlands":"🇳🇱", "France":"🇫🇷", "United Kingdom":"🇬🇧", "Russia":"🇷🇺", "China":"🇨🇳", "Singapore":"🇸🇬" };
const SUBDOMAINS = ['www','mail','api','vpn','admin','portal'];

// ==================== ERROR BOUNDARY ====================
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary caught:', error, errorInfo); }
  render() {
    if (this.state.hasError) return <div className="min-h-screen bg-[#05070A] text-red-500 p-8 font-mono">Something went wrong. Please refresh.</div>;
    return this.props.children;
  }
}

// ==================== SUBCOMPONENTS ====================
function RiskBadge({ port }) { const risk = PORT_RISK[port]||2; const label = PORT_LABELS[port]||String(port); const cls = risk>=7?"bg-red-500/20 text-red-300 border-red-500/40":risk>=5?"bg-orange-500/20 text-orange-300 border-orange-500/40":"bg-cyan-500/10 text-cyan-300 border-cyan-500/30"; return <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${cls}`}>{label}</span>; }
function ScoreDot({ score, max=30 }) { const pct = Math.min(100,Math.round((score/max)*100)); const color = pct>=70?"from-red-500 to-orange-500":pct>=40?"from-yellow-400 to-amber-500":"from-cyan-500 to-green-400"; return (<div className="flex items-center gap-1.5"><div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${color}`} style={{width:`${pct}%`}}/></div><span className="text-[10px] font-mono text-cyan-400">{score}</span></div>); }
function Chip({ children, color="gray", glow=false }) { const c = { green:`bg-green-500/20 text-green-300 border-green-500/40 ${glow?"shadow-[0_0_8px_#00ff00]":""}`, red:`bg-red-500/20 text-red-300 border-red-500/40 ${glow?"shadow-[0_0_8px_#ff3333]":""}`, orange:"bg-orange-500/20 text-orange-300 border-orange-500/30", cyan:`bg-cyan-500/20 text-cyan-300 border-cyan-500/40 ${glow?"shadow-[0_0_8px_#00ffff]":""}`, purple:"bg-purple-500/20 text-purple-300 border-purple-500/30", gray:"bg-white/8 text-white/50 border-white/15" }[color]; return <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${c}`}>{children}</span>; }
function ProgressBar({ pct, color="cyan" }) { const c = color==="green"?"from-green-500 to-emerald-400":"from-cyan-500 to-blue-500"; return (<div className="w-full h-0.5 bg-cyan-500/10"><div className={`h-full bg-gradient-to-r ${c} transition-all duration-500 shadow-[0_0_6px_#00ff66]`} style={{width:`${pct}%`}}/></div>); }

// ==================== AUTHORIZATION GATE ====================
function AuthorizationGate({ children }) {
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem('scanner_consent');
    if (consent === 'true') setAuthorized(true);
  }, []);
  const handleConsent = () => {
    localStorage.setItem('scanner_consent', 'true');
    setAuthorized(true);
  };
  if (authorized) return children;
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 font-mono">
      <div className="max-w-md bg-[#05070A] border border-red-500/50 rounded-xl p-6 text-center shadow-[0_0_30px_#ff000040] glass-panel">
        <div className="text-red-500 text-2xl mb-4 neon-text">⚠️ LEGAL WARNING</div>
        <p className="text-[#00f0ff] text-sm mb-4">This tool performs active network scanning and probing. Using it against systems <strong>without explicit written permission</strong> is illegal.</p>
        <p className="text-white/80 text-xs mb-6">By clicking "I Understand", you confirm that you are authorized to scan the targets you intend to test and accept full legal responsibility.</p>
        <button onClick={handleConsent} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition">I Understand – Proceed</button>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
function ScannerApp() {
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const [splashStage, setSplashStage] = useState(0);
  const [splashComplete, setSplashComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [toolsMode, setToolsMode] = useState('proxy'); // 'proxy' or 'ssl'
  const [showSniOptions, setShowSniOptions] = useState(false);
  const [showReconOptions, setShowReconOptions] = useState(false);

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

  const [reconDomains, setReconDomains] = useState("accenture.com\nmtn.co.za\nvodacom.co.za");
  const [reconProfile, setReconProfile] = useState("all");
  const [reconStatus, setReconStatus] = useState("idle");
  const [reconResults, setReconResults] = useState([]);
  const [reconProgress, setReconProgress] = useState(0);
  const [reconError, setReconError] = useState("");
  const [showHighlights, setShowHighlights] = useState(false);

  const [proxyHost, setProxyHost] = useState("");
  const [proxyPort, setProxyPort] = useState("3128,8888,9090,1080,8118");
  const [proxyTarget, setProxyTarget] = useState("https://httpbin.org/ip");
  const [proxyResult, setProxyResult] = useState(null);
  const [proxyLoading, setProxyLoading] = useState(false);

  const [sslDomain, setSslDomain] = useState("");
  const [sslResult, setSslResult] = useState(null);
  const [sslLoading, setSslLoading] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState(['[00:00] System ready.', '[00:01] Awaiting command...']);
  const [scanMetrics, setScanMetrics] = useState({ aps: 0, total: 0, elapsed: '00:00' });
  const scanStartTime = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const sniAbortController = useRef(null);
  const reconAbortController = useRef(null);
  const reconPendingResults = useRef([]);
  const reconBatchTimer = useRef(null);

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { setMounted(true); }, []);
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
  useEffect(() => { const saved = localStorage.getItem('scanner_stats'); if (saved) setStats(JSON.parse(saved)); }, []);
  useEffect(() => {
    if (sniStatus === 'running' || reconStatus === 'running') {
      scanStartTime.current = Date.now();
      const interval = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - scanStartTime.current) / 1000);
        const mins = Math.floor(elapsedSec / 60).toString().padStart(2,'0');
        const secs = (elapsedSec % 60).toString().padStart(2,'0');
        setScanMetrics(prev => ({
          aps: Math.floor(Math.random() * 500) + 200,
          total: prev.total + 10,
          elapsed: `${mins}:${secs}`
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sniStatus, reconStatus]);
  useEffect(() => {
    return () => {
      sniAbortController.current?.abort();
      reconAbortController.current?.abort();
      if (reconBatchTimer.current) clearTimeout(reconBatchTimer.current);
    };
  }, []);

  const addLog = (text) => setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  const copyToClipboard = (text, label = 'Copied!') => {
    const fallbackCopy = () => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try { document.execCommand('copy'); toast.success(label); } catch { toast.error('Failed to copy'); }
      document.body.removeChild(textArea);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => toast.success(label)).catch(fallbackCopy);
    } else { fallbackCopy(); }
  };
  const updateStats = (type, extra = {}) => {
    setStats(prev => {
      const updated = { ...prev, sniScans: prev.sniScans + (type==='sni'?1:0), reconScans: prev.reconScans + (type==='recon'?1:0), proxiesFound: prev.proxiesFound + (extra.proxies||0), lastScan: new Date().toISOString() };
      localStorage.setItem('scanner_stats', JSON.stringify(updated));
      return updated;
    });
  };

  async function launchSNI() {
    sniAbortController.current?.abort();
    sniAbortController.current = new AbortController();
    setSniError(""); setSniResults([]); setSniTested(0); setScanMetrics({ aps:0, total:0, elapsed:'00:00' });
    const hosts = sniCustomText.trim() ? sniCustomText.split("\n").map(s=>s.trim()).filter(Boolean) : PRESET_GROUPS[sniPreset]||ALL_SA_DOMAINS;
    setSniTotal(hosts.length); setSniStatus("running");
    addLog(`Starting SNI scan on ${hosts.length} hosts...`);
    toast.loading(`Scanning ${hosts.length} SNI hosts...`, { id: 'sni-scan' });
    try {
      const r = await fetch('/api/sniScan',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({sni_hosts:hosts,target_ip:sniTargetIP||null,port:parseInt(sniPort)||443,probe_http:sniProbeHTTP,probe_geo:sniProbeGeo}),
        signal: sniAbortController.current.signal
      });
      const d = await r.json();
      if(d.error){ setSniError(d.error); setSniStatus("error"); toast.error(d.error, { id: 'sni-scan' }); addLog(`ERROR: ${d.error}`); }
      else { setSniResults(d.results); setSniStatus("done"); setSniTested(d.tested); toast.success(`Found ${d.results.length} working SNIs`, { id: 'sni-scan' }); addLog(`SUCCESS: ${d.results.length} working SNIs found.`); updateStats('sni'); }
    } catch(e){
      if (e.name === 'AbortError') { setSniStatus("idle"); toast.dismiss('sni-scan'); addLog('SNI scan cancelled.'); return; }
      setSniError(e.message); setSniStatus("error"); toast.error(e.message, { id: 'sni-scan' }); addLog(`ERROR: ${e.message}`);
    } finally { sniAbortController.current = null; }
  }

  const flushReconResults = useCallback(() => {
    if (reconPendingResults.current.length === 0) return;
    setReconResults(prev => [...prev, ...reconPendingResults.current]);
    reconPendingResults.current = [];
    reconBatchTimer.current = null;
  }, []);

  async function launchRecon() {
    reconAbortController.current?.abort();
    reconAbortController.current = new AbortController();
    setReconError(""); setReconResults([]); setReconProgress(0); setScanMetrics({ aps:0, total:0, elapsed:'00:00' });
    const domains = reconDomains.split("\n").map(s=>s.trim()).filter(Boolean);
    if(!domains.length){ setReconError("Enter at least one domain."); toast.error("Enter at least one domain."); return; }
    setReconStatus("running"); setReconProgress(5);
    addLog(`Starting Recon on ${domains.length} domains...`);
    toast.loading(`Scanning ${domains.length} domains...`, { id: 'recon-scan' });
    const all = []; const concurrency=3; const chunks=[];
    for(let i=0;i<domains.length;i+=concurrency) chunks.push(domains.slice(i,i+concurrency));
    try {
      for(const c of chunks) {
        await Promise.all(c.map(async d=>{
          try {
            const r = await fetch('/api/reconSingle',{
              method:'POST', headers:{'Content-Type':'application/json'},
              body:JSON.stringify({domain:d,profile:reconProfile}),
              signal: reconAbortController.current.signal
            });
            const data = await r.json();
            if(data.results) {
              all.push(...data.results);
              reconPendingResults.current.push(...data.results);
              if (!reconBatchTimer.current) reconBatchTimer.current = setTimeout(flushReconResults, 100);
            }
            const completedDomains = all.length / (SUBDOMAINS.length + 1);
            const totalEstimate = domains.length * (SUBDOMAINS.length + 1);
            setReconProgress(Math.min(95, 5 + (completedDomains / totalEstimate) * 90));
          } catch(err){ console.error(err); }
        }));
        if (reconBatchTimer.current) { clearTimeout(reconBatchTimer.current); flushReconResults(); }
      }
      flushReconResults();
      const proxyCount = all.filter(r=>r.proxy_ok).length;
      setReconStatus("done"); setReconProgress(100);
      toast.success(`Recon complete – ${all.length} live hosts, ${proxyCount} proxies`, { id: 'recon-scan' });
      addLog(`SUCCESS: ${all.length} live hosts, ${proxyCount} proxies found.`);
      updateStats('recon', { proxies: proxyCount });
    } catch(e){
      if (e.name === 'AbortError') { setReconStatus("idle"); toast.dismiss('recon-scan'); addLog('Recon scan cancelled.'); return; }
      setReconError(e.message); setReconStatus("error"); toast.error(e.message, { id: 'recon-scan' }); addLog(`ERROR: ${e.message}`);
    } finally { reconAbortController.current = null; }
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

  const sniDisplayed = sniResults.filter(r => r.ok);
  const reconLive = reconResults.filter(r=>r.ips?.length);
  const scanning = sniStatus === "running" || reconStatus === "running";

  if (!splashComplete) {
    const stage = SPLASH_STAGES[splashStage] || SPLASH_STAGES[SPLASH_STAGES.length - 1];
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center font-mono">
        <img src={stage.image} alt={stage.text} className="absolute inset-0 w-full h-full object-contain md:object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative z-10 text-center px-4 py-8 max-w-md w-full">
          <div className="text-[#00f0ff] text-base sm:text-lg md:text-xl mb-4 tracking-widest animate-pulse neon-text">{stage.text}</div>
          {stage.subtext && <div className="text-[#00ff66] text-sm sm:text-base mb-6 whitespace-pre-line leading-relaxed neon-text">{stage.subtext}</div>}
          {stage.progress !== undefined && (
            <div className="w-full h-1.5 bg-[#00f0ff]/20 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#00ff66] transition-all duration-300 shadow-[0_0_8px_#00ff66]" style={{ width: `${stage.progress}%` }} />
              <div className="text-right text-[#00f0ff] text-xs mt-0.5">{stage.progress}%</div>
            </div>
          )}
          <div className="text-[#00f0ff]/40 text-xs sm:text-sm tracking-widest">BruteforceScannerR</div>
        </div>
      </div>
    );
  }

  return (
    <AuthorizationGate>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/jpeg" href="/logo.jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <title>Bruteforce Recon</title>
      </Head>
      <div className="min-h-screen text-white font-sans text-sm relative scan-lines bg-grid" style={{ backgroundImage: "url('/background.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]"/>
        <div className="relative z-10 pb-20">
          <div className="bg-[#05070A]/90 border-b border-[#1A2A3A] px-4 py-1 text-[10px] sm:text-xs text-[#8899aa] flex justify-between items-center font-mono backdrop-blur-xl">
            <div className="flex gap-4">
              <span className="text-[#00ff66] neon-text">📡 {scanning ? 'ACTIVE' : 'IDLE'}</span>
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex gap-4 items-center">
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-[#00f0ff]/60 hover:text-[#00ff66]" aria-label="Toggle sound">
                {soundEnabled ? <FiVolume2 size={14} /> : <FiVolumeX size={14} />}
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 py-6">
            {/* DASHBOARD */}
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#00ff66] to-[#00f0ff] neon-text">BRUTEFORCE RECON</h1>
                  <p className="text-[#8899aa] text-xs tracking-widest mt-1">COMMAND CENTER</p>
                  <p className="text-[#00f0ff]/30 text-[10px] mt-0.5">v2.0 · BUILT BY ALPHA-MASTERMIND</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-4 text-center">
                    <div className="text-3xl font-mono font-bold text-[#00ff66] neon-text">{stats.sniScans}</div>
                    <div className="text-[10px] text-[#8899aa] uppercase mt-1">SNI Scans</div>
                  </div>
                  <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-4 text-center">
                    <div className="text-3xl font-mono font-bold text-[#a855f7] neon-text">{stats.reconScans}</div>
                    <div className="text-[10px] text-[#8899aa] uppercase mt-1">Recon</div>
                  </div>
                  <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-4 text-center">
                    <div className="text-3xl font-mono font-bold text-[#10b981] neon-text">{stats.proxiesFound}</div>
                    <div className="text-[10px] text-[#8899aa] uppercase mt-1">Proxies</div>
                  </div>
                </div>
                {scanning && (
                  <div className="bg-[#05070A] border border-[#00ff66]/30 rounded-xl p-4">
                    <div className="flex justify-between"><span className="text-[#00ff66] font-mono">LIVE SCAN</span><span className="text-[#00f0ff] text-xs">{scanMetrics.elapsed}</span></div>
                    <div className="text-xs text-[#8899aa] mt-1">Attempts/sec: {scanMetrics.aps} · Total: {scanMetrics.total}</div>
                    <ProgressBar pct={50} color="cyan" />
                  </div>
                )}
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => setTab('sni')} className="bg-[#0A0F18] border border-[#1A2A3A] rounded-xl p-3 text-center hover:border-[#00f0ff]/50 transition">
                    <FiShield className="text-[#00f0ff] mx-auto mb-1" size={20} /><span className="text-[10px] text-[#8899aa]">SNI</span>
                  </button>
                  <button onClick={() => setTab('recon')} className="bg-[#0A0F18] border border-[#1A2A3A] rounded-xl p-3 text-center hover:border-[#a855f7]/50 transition">
                    <FiGlobe className="text-[#a855f7] mx-auto mb-1" size={20} /><span className="text-[10px] text-[#8899aa]">Recon</span>
                  </button>
                  <button onClick={() => { setTab('tools'); setToolsMode('proxy'); }} className="bg-[#0A0F18] border border-[#1A2A3A] rounded-xl p-3 text-center hover:border-[#10b981]/50 transition">
                    <FiZap className="text-[#10b981] mx-auto mb-1" size={20} /><span className="text-[10px] text-[#8899aa]">Proxy</span>
                  </button>
                  <button onClick={() => { setTab('tools'); setToolsMode('ssl'); }} className="bg-[#0A0F18] border border-[#1A2A3A] rounded-xl p-3 text-center hover:border-[#ef4444]/50 transition">
                    <FiActivity className="text-[#ef4444] mx-auto mb-1" size={20} /><span className="text-[10px] text-[#8899aa]">SSL</span>
                  </button>
                </div>
                <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl overflow-hidden">
                  <button onClick={() => setShowTerminal(!showTerminal)} className="w-full px-4 py-3 flex items-center justify-between text-[#00f0ff] text-xs font-mono">
                    <span>▼ Terminal Log</span>
                    <FiChevronDown size={14} className={`transition-transform ${showTerminal ? 'rotate-180' : ''}`} />
                  </button>
                  {showTerminal && (
                    <div className="px-4 pb-3 h-40 overflow-y-auto font-mono text-[10px] space-y-1 border-t border-[#1A2A3A] pt-2">
                      {terminalLogs.map((log, i) => <div key={i} className="text-[#00ff66]">{log}</div>)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SNI SCANNER */}
            {tab === "sni" && (
              <div className="space-y-5">
                <div className="text-center">
                  <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#00ff66] to-[#00f0ff] neon-text">SNI SCANNER</h1>
                  <p className="text-[#8899aa] text-xs tracking-widest mt-1">REAL‑TIME SNI VALIDATION</p>
                  <p className="text-[#00f0ff]/30 text-[10px] mt-0.5">v2.0 · BUILT BY ALPHA-MASTERMIND</p>
                </div>
                <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-4">
                  <textarea value={sniCustomText} onChange={(e) => setSniCustomText(e.target.value)} rows={6} placeholder="Enter SNI hosts (one per line)...&#10;Example:&#10;moya.app&#10;nofunds.mtn.co.za" className="w-full bg-transparent text-sm font-mono text-[#00ff66] placeholder-[#8899aa]/40 focus:outline-none resize-none" />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-[#8899aa] font-mono">{(sniCustomText.trim() ? sniCustomText.split('\n').filter(Boolean).length : (PRESET_GROUPS[sniPreset] || []).length)} host(s) ready</span>
                    <button onClick={() => setShowSniOptions(!showSniOptions)} className="text-[#00f0ff]/60 hover:text-[#00ff66] text-xs font-mono flex items-center gap-1">
                      <FiChevronDown size={14} className={`transition-transform ${showSniOptions ? 'rotate-180' : ''}`} /> Options
                    </button>
                  </div>
                </div>
                {showSniOptions && (
                  <div className="bg-[#0A0F18] border border-[#1A2A3A] rounded-xl p-4 space-y-3 animate-slideIn">
                    <div>
                      <label className="text-[10px] text-[#8899aa] uppercase block mb-1">Preset</label>
                      <select value={sniPreset} onChange={(e) => { setSniPreset(e.target.value); setSniCustomText(''); }} className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-3 py-2 text-xs font-mono text-[#00f0ff]">
                        {Object.keys(PRESET_GROUPS).map(name => <option key={name} value={name}>{name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] text-[#8899aa] uppercase block mb-1">Port</label><input value={sniPort} onChange={e => setSniPort(e.target.value)} className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-3 py-2 text-xs font-mono text-[#00f0ff]" /></div>
                      <div><label className="text-[10px] text-[#8899aa] uppercase block mb-1">Target IP</label><input value={sniTargetIP} onChange={e => setSniTargetIP(e.target.value)} placeholder="Auto" className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-3 py-2 text-xs font-mono text-[#00f0ff] placeholder-[#8899aa]/30" /></div>
                    </div>
                    <div className="flex gap-4">
                      {[[sniProbeHTTP, setSniProbeHTTP, 'HTTP'], [sniProbeGeo, setSniProbeGeo, 'GeoIP']].map(([val, set, label]) => (
                        <label key={label} className="flex items-center gap-2">
                          <div onClick={() => set(v => !v)} className={`w-8 h-4 rounded-full relative border ${val ? 'bg-[#00ff66]/20 border-[#00ff66]' : 'bg-[#05070A] border-[#1A2A3A]'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${val ? 'left-4 bg-[#00ff66]' : 'left-0.5 bg-[#8899aa]'}`} />
                          </div>
                          <span className="text-[10px] text-[#8899aa]">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={launchSNI} disabled={sniStatus === 'running'} className="relative w-full py-4 rounded-xl font-bold tracking-widest text-sm uppercase overflow-hidden group disabled:opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00cc66] to-[#00994d] transition-all duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[#00ff66] opacity-0 group-hover:opacity-20" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white">{sniStatus === 'running' ? <><span className="animate-spin">⟳</span> SCANNING...</> : <>▶ START SCAN</>}</span>
                </button>
                {sniDisplayed.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-[#00ff66] font-mono">{sniDisplayed.length} VALID</span><span className="text-[#8899aa] text-xs">{sniTested} scanned</span></div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {sniDisplayed.map((r, i) => (
                        <div key={i} className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-3">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff66]" /><span className="text-[#00f0ff] font-mono truncate">{r.sni}</span><Chip color="green" glow>ACTIVE</Chip></div>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] font-mono">
                            <div><span className="text-[#8899aa]">IP:</span> <span className="text-[#00ff66]">{r.ip}:{r.port}</span></div>
                            <div><span className="text-[#8899aa]">HTTP:</span> <span className={r.http?.status < 300 ? 'text-[#00ff66]' : 'text-[#ffb347]'}>{r.http?.status || '—'}</span></div>
                            {r.geo && <div className="col-span-2"><span className="text-[#8899aa]">Location:</span> <span className="text-[#00f0ff]">{FLAGS[r.geo.country]} {r.geo.city}, {r.geo.country}</span></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RECON */}
            {tab === "recon" && (
              <div className="space-y-5">
                <div className="text-center">
                  <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#a855f7] neon-text">RECON SCANNER</h1>
                  <p className="text-[#8899aa] text-xs tracking-widest mt-1">SUBDOMAIN & PORT ENUMERATION</p>
                  <p className="text-[#a855f7]/30 text-[10px] mt-0.5">v2.0 · BUILT BY ALPHA-MASTERMIND</p>
                </div>
                <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-4">
                  <textarea value={reconDomains} onChange={(e) => setReconDomains(e.target.value)} rows={4} placeholder="Enter domains (one per line)...&#10;mtn.co.za&#10;vodacom.co.za" className="w-full bg-transparent text-sm font-mono text-[#00ff66] placeholder-[#8899aa]/40 focus:outline-none resize-none" />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-[#8899aa] font-mono">{reconDomains.split('\n').filter(Boolean).length} domain(s)</span>
                    <button onClick={() => setShowReconOptions(!showReconOptions)} className="text-[#a855f7]/60 hover:text-[#c084fc] text-xs font-mono flex items-center gap-1">
                      <FiChevronDown size={14} className={`transition-transform ${showReconOptions ? 'rotate-180' : ''}`} /> Options
                    </button>
                  </div>
                </div>
                {showReconOptions && (
                  <div className="bg-[#0A0F18] border border-[#1A2A3A] rounded-xl p-4 space-y-3">
                    <div><label className="text-[10px] text-[#8899aa] uppercase block mb-1">Port Profile</label><div className="grid grid-cols-4 gap-2">{Object.keys(PORT_PROFILES).map(k => <button key={k} onClick={() => setReconProfile(k)} className={`py-2 rounded-lg text-xs uppercase font-mono border ${reconProfile === k ? 'bg-[#a855f7]/10 text-[#c084fc] border-[#a855f7]/50' : 'bg-[#05070A] text-[#8899aa] border-[#1A2A3A]'}`}>{k}</button>)}</div></div>
                    <label className="flex items-center gap-2"><div onClick={() => setShowHighlights(v => !v)} className={`w-8 h-4 rounded-full relative border ${showHighlights ? 'bg-red-500/20 border-red-500' : 'bg-[#05070A] border-[#1A2A3A]'}`}><div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${showHighlights ? 'left-4 bg-red-500' : 'left-0.5 bg-[#8899aa]'}`} /></div><span className="text-[10px] text-[#8899aa]">Highlights only</span></label>
                  </div>
                )}
                <button onClick={launchRecon} disabled={reconStatus === 'running'} className="relative w-full py-4 rounded-xl font-bold tracking-widest text-sm uppercase overflow-hidden group disabled:opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#7e22ce] transition-all duration-300 group-hover:scale-105" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white">{reconStatus === 'running' ? <><span className="animate-spin">⟳</span> SCANNING...</> : <>▶ LAUNCH RECON</>}</span>
                </button>
                {reconStatus === 'running' && <ProgressBar pct={reconProgress} color="purple" />}
                {reconLive.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-[#c084fc] font-mono">{reconLive.length} LIVE</span><span className="text-[#8899aa] text-xs">{reconLive.filter(r => r.proxy_ok).length} proxies</span></div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {reconLive.map((r, i) => (
                        <div key={i} className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-3">
                          <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${r.highlight ? 'bg-red-400' : 'bg-[#a855f7]'}`} /><span className="text-[#c084fc] font-mono truncate">{r.domain}</span>{r.proxy_ok && <Chip color="green" glow>PROXY</Chip>}<ScoreDot score={r.score} /></div>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] font-mono">
                            <div><span className="text-[#8899aa]">IP:</span> <span className="text-[#00ff66]">{r.ips?.[0] || '—'}</span></div>
                            <div><span className="text-[#8899aa]">Ports:</span> <span className="text-[#00f0ff]">{r.open_ports?.join(', ') || '—'}</span></div>
                            {r.http?.title && <div className="col-span-2"><span className="text-[#8899aa]">Title:</span> <span className="text-[#00f0ff]">{r.http.title}</span></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TOOLS (Proxy + SSL) */}
            {tab === "tools" && (
              <div className="space-y-5">
                <div className="text-center">
                  <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#10b981] neon-text">{toolsMode === 'proxy' ? 'PROXY TESTER' : 'SSL SCANNER'}</h1>
                  <p className="text-[#8899aa] text-xs tracking-widest mt-1">{toolsMode === 'proxy' ? 'MULTI‑PORT VALIDATION' : 'CERTIFICATE VALIDATION'}</p>
                  <p className="text-[#10b981]/30 text-[10px] mt-0.5">v2.0 · BUILT BY ALPHA-MASTERMIND</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setToolsMode('proxy')} className={`flex-1 py-2 rounded-lg text-xs font-mono border ${toolsMode === 'proxy' ? 'bg-[#10b981]/10 text-[#34d399] border-[#10b981]/50' : 'bg-[#05070A] text-[#8899aa] border-[#1A2A3A]'}`}>Proxy Tester</button>
                  <button onClick={() => setToolsMode('ssl')} className={`flex-1 py-2 rounded-lg text-xs font-mono border ${toolsMode === 'ssl' ? 'bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/50' : 'bg-[#05070A] text-[#8899aa] border-[#1A2A3A]'}`}>SSL Scanner</button>
                </div>
                {toolsMode === 'proxy' ? (
                  <>
                    <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-4 space-y-3">
                      <input value={proxyHost} onChange={e => setProxyHost(e.target.value)} placeholder="Proxy host (e.g., api.vodacom.co.za)" className="w-full bg-transparent border border-[#1A2A3A] rounded-lg px-3 py-2 text-sm font-mono text-[#00ff66] placeholder-[#8899aa]/40" />
                      <input value={proxyPort} onChange={e => setProxyPort(e.target.value)} placeholder="Ports (3128,8888,9090...)" className="w-full bg-transparent border border-[#1A2A3A] rounded-lg px-3 py-2 text-sm font-mono text-[#00ff66] placeholder-[#8899aa]/40" />
                      <input value={proxyTarget} onChange={e => setProxyTarget(e.target.value)} placeholder="Target URL" className="w-full bg-transparent border border-[#1A2A3A] rounded-lg px-3 py-2 text-sm font-mono text-[#00ff66]" />
                    </div>
                    <button onClick={testProxy} disabled={proxyLoading} className="relative w-full py-4 rounded-xl font-bold tracking-widest text-sm uppercase overflow-hidden group disabled:opacity-30">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10b981] to-[#059669] transition-all duration-300 group-hover:scale-105" />
                      <span className="relative z-10 flex items-center justify-center gap-2 text-white">{proxyLoading ? <><span className="animate-spin">⟳</span> TESTING...</> : <>▶ TEST ALL PORTS</>}</span>
                    </button>
                    {proxyResult && (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {proxyResult.results?.map((r, i) => (
                          <div key={i} className={`p-3 rounded-xl border ${r.success ? 'bg-[#10b981]/5 border-[#10b981]/30' : 'bg-[#ef4444]/5 border-[#ef4444]/30'}`}>
                            <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${r.success ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`} /><span className="text-sm font-mono text-[#00f0ff]">Port {r.port}</span></div>
                            {r.success && r.data ? <pre className="text-[#00ff66] text-[10px] mt-2 overflow-x-auto">{JSON.stringify(r.data, null, 2)}</pre> : <div className="text-[10px] text-[#ef4444] mt-2">{r.error || 'Failed'}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-4">
                      <input value={sslDomain} onChange={e => setSslDomain(e.target.value)} placeholder="Domain (e.g., arenaplus.co.za)" className="w-full bg-transparent border border-[#1A2A3A] rounded-lg px-3 py-2 text-sm font-mono text-[#00ff66] placeholder-[#8899aa]/40" />
                    </div>
                    <button onClick={scanSSL} disabled={sslLoading} className="relative w-full py-4 rounded-xl font-bold tracking-widest text-sm uppercase overflow-hidden group disabled:opacity-30">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] transition-all duration-300 group-hover:scale-105" />
                      <span className="relative z-10 flex items-center justify-center gap-2 text-white">{sslLoading ? <><span className="animate-spin">⟳</span> SCANNING...</> : <>▶ SCAN SSL</>}</span>
                    </button>
                    {sslResult && (
                      <div className={`p-4 rounded-xl border ${sslResult.success ? 'bg-[#10b981]/5 border-[#10b981]/30' : 'bg-[#ef4444]/5 border-[#ef4444]/30'}`}>
                        {sslResult.success ? (
                          <div className="space-y-1 text-xs font-mono">
                            <div><span className="text-[#8899aa]">Domain:</span> <span className="text-[#00f0ff]">{sslResult.domain}</span></div>
                            <div><span className="text-[#8899aa]">Issuer:</span> <span className="text-[#00f0ff]">{sslResult.issuer}</span></div>
                            <div><span className="text-[#8899aa]">Valid:</span> <span className="text-[#00f0ff]">{sslResult.validFrom} → {sslResult.validTo}</span></div>
                            {sslResult.daysRemaining !== null && <div><span className="text-[#8899aa]">Days left:</span> <span className={sslResult.daysRemaining < 30 ? 'text-[#ef4444]' : sslResult.daysRemaining < 90 ? 'text-[#ffb347]' : 'text-[#10b981]'}>{sslResult.daysRemaining}</span></div>}
                          </div>
                        ) : <div className="text-[#ef4444]">{sslResult.error}</div>}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#05070A]/95 border-t border-[#1A2A3A] backdrop-blur-xl flex justify-around py-2 z-40">
            {[
              { id: 'dashboard', icon: '📊', label: 'Home' },
              { id: 'sni', icon: '📡', label: 'SNI' },
              { id: 'recon', icon: '🔍', label: 'Recon' },
              { id: 'tools', icon: '⚙️', label: 'Tools' },
            ].map(item => (
              <button key={item.id} onClick={() => setTab(item.id)} className={`flex flex-col items-center px-4 py-1 rounded-lg transition ${tab === item.id ? 'text-[#00ff66] neon-text' : 'text-[#8899aa]'}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-mono tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AuthorizationGate>
  );
}

export default function Scanner() {
  return (
    <ErrorBoundary>
      <ScannerApp />
    </ErrorBoundary>
  );
}
