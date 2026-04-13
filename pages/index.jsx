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
function StatCard({ label, value, color="cyan", icon, sub }) { const cols = { red:"text-red-400 border-red-500/20 bg-red-500/5", orange:"text-orange-400 border-orange-500/20 bg-orange-500/5", cyan:"text-cyan-400 border-cyan-500/20 bg-cyan-500/5", green:"text-green-400 border-green-500/20 bg-green-500/5", purple:"text-purple-400 border-purple-500/20 bg-purple-500/5", yellow:"text-yellow-400 border-yellow-500/20 bg-yellow-500/5" }; return (<div className={`border rounded-xl p-4 backdrop-blur-sm card-hover stat-card-glow glass-panel ${cols[color]}`}><div className="text-2xl font-bold font-mono neon-text">{icon} {value}</div><div className="text-xs text-cyan-400/80 mt-1 tracking-wider">{label}</div>{sub && <div className="text-[10px] text-white/30 mt-0.5">{sub}</div>}</div>); }
function ProgressBar({ pct, color="cyan" }) { const c = color==="green"?"from-green-500 to-emerald-400":"from-cyan-500 to-blue-500"; return (<div className="w-full h-0.5 bg-cyan-500/10"><div className={`h-full bg-gradient-to-r ${c} transition-all duration-500 shadow-[0_0_6px_#00ff66]`} style={{width:`${pct}%`}}/></div>); }
function SkeletonRow() { return (<tr className="animate-pulse"><td className="pl-3 py-2.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/30 rounded w-12"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/30 rounded w-32"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/30 rounded w-20"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/30 rounded w-16"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/30 rounded w-10"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/30 rounded w-24"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/30 rounded w-10"/></td><td className="px-3 py-2.5"><div className="h-3 bg-cyan-500/30 rounded w-8"/></td><td className="px-2 py-2.5"><div className="w-3 h-3 bg-cyan-500/30 rounded"/></td></tr>); }

function MetricsPanel({ aps, totalAttempts, elapsed }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#1A2A3A] bg-gradient-to-br from-[#05070A] to-[#0A0F18] p-5 shadow-[0_0_30px_#00ff6608]">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00ff66] to-transparent animate-pulse" />
      <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
        <div><div className="text-[#8899aa] text-xs tracking-widest mb-1">ATTEMPTS/SEC</div><div className="text-4xl font-mono font-bold text-[#00ff66] drop-shadow-[0_0_15px_#00ff66] neon-text">{aps}</div></div>
        <div><div className="text-[#8899aa] text-xs tracking-widest mb-1">TOTAL ATTEMPTS</div><div className="text-4xl font-mono font-bold text-[#00ff66] drop-shadow-[0_0_15px_#00ff66] neon-text">{totalAttempts}</div></div>
        <div><div className="text-[#8899aa] text-xs tracking-widest mb-1">ELAPSED</div><div className="text-4xl font-mono font-bold text-[#00ff66] drop-shadow-[0_0_15px_#00ff66] neon-text">{elapsed}</div></div>
      </div>
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00ff66]/30 rounded-tl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00ff66]/30 rounded-br-lg" />
    </div>
  );
}

function TerminalLog({ logs }) {
  const endRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  useEffect(() => { if (isClient) endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs, isClient]);
  if (!isClient) return <div className="bg-[#05070A] border border-[#1A2A3A] rounded-lg p-4 h-48 card-hover glass-panel">Loading terminal...</div>;
  return (
    <div className="bg-[#05070A] border border-[#1A2A3A] rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs sm:text-sm relative" aria-live="polite">
      <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-5" />
      <div className="relative z-10">
        {logs.map((log, i) => <div key={`log-${i}`} className="text-[#00ff66] animate-slideIn break-all neon-text">{log}</div>)}
        <div className="flex items-center gap-2 mt-2 text-[#00ff66]">
          <span className="text-[#00f0ff]">$</span>
          <span className="flex-1">_</span>
          <div className="blink-cursor"></div>
        </div>
      </div>
      <div ref={endRef} />
    </div>
  );
}

function AttemptGraph({ dataPoints }) {
  const canvasRef = useRef();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.parentElement?.clientWidth || 800;
    canvas.width = width;
    canvas.height = 200;
    ctx.clearRect(0, 0, width, 200);
    ctx.strokeStyle = '#1A2A3A';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) { const y = i * 50; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    ctx.shadowColor = '#00ff66';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const step = width / dataPoints.length;
    dataPoints.forEach((v, i) => { const x = i * step; const y = 200 - (v / 100) * 200; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [dataPoints, isClient]);
  if (!isClient) return <div className="bg-[#05070A] border border-[#1A2A3A] rounded-lg p-4 h-48 card-hover glass-panel">Loading graph...</div>;
  return <canvas ref={canvasRef} className="w-full h-48" />;
}

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
        <button onClick={handleConsent} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition btn-gradient">I Understand – Proceed</button>
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
  
  const [terminalLogs, setTerminalLogs] = useState(['[00:00] System ready.', '[00:01] Awaiting command...']);
  const [graphData, setGraphData] = useState([10,30,20,50,40,60,80,70,90,85]);
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
        setGraphData(prev => [...prev.slice(-59), Math.floor(Math.random() * 100)]);
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

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '1') setTab('dashboard');
      if (e.key === '2') setTab('sni');
      if (e.key === '3') setTab('recon');
      if (e.key === '4') setTab('proxy');
      if (e.key === '5') setTab('ssl');
      if (e.key === 'Enter') {
        if (tab === 'sni' && sniStatus !== 'running') launchSNI();
        if (tab === 'recon' && reconStatus !== 'running') launchRecon();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [tab, sniStatus, reconStatus]);

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
    } else {
      fallbackCopy();
    }
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
    setSniError(""); setSniResults([]); setSniTested(0); setScanMetrics({ aps:0, total:0, elapsed:'00:00' }); setGraphData([]);
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
    setReconError(""); setReconResults([]); setReconProgress(0); setScanMetrics({ aps:0, total:0, elapsed:'00:00' }); setGraphData([]);
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

  const sniDisplayed = useMemo(() => {
    let filtered = sniResults.filter(r=>!sniFilter||r.sni.includes(sniFilter)||(r.geo?.country||"").toLowerCase().includes(sniFilter.toLowerCase()));
    if (sniSortField) {
      filtered.sort((a,b) => {
        let valA = a[sniSortField] || '', valB = b[sniSortField] || '';
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
        let valA = a[reconSortField] || '', valB = b[reconSortField] || '';
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
  const totalHosts = sniResults.length + reconLive.length;

  const SortableHeader = ({ field, children, currentField, setField, asc, setAsc }) => (
    <th className="px-3 py-2 text-left cursor-pointer hover:text-[#00f0ff] transition" onClick={() => { if (currentField === field) setAsc(!asc); else { setField(field); setAsc(true); } }}>
      <div className="flex items-center gap-1">{children}{currentField === field && (asc ? <FiChevronUp size={12} className="text-[#00f0ff]"/> : <FiChevronDown size={12} className="text-[#00f0ff]"/>)}</div>
    </th>
  );

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
        <div className="relative z-10 pb-16 md:pb-0">
          {/* System Status Bar */}
          <div className="bg-[#05070A]/90 border-b border-[#1A2A3A] px-4 py-1 text-[10px] sm:text-xs text-[#8899aa] flex justify-between items-center font-mono backdrop-blur-xl">
            <div className="flex gap-4">
              <span className="text-[#00ff66] neon-text">📡 {scanning ? 'ACTIVE' : 'IDLE'}</span>
              <span>🔒 TLS 1.3</span>
              <span className="hidden sm:inline">🌐 {totalHosts} HOSTS</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-[#00f0ff]">{currentTime.toLocaleTimeString()}</span>
              <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${scanning ? 'bg-[#00ff66] animate-pulse' : 'bg-[#00f0ff]'}`}></span><span className="text-[#00ff66]">SYS.OK</span></span>
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-[#00f0ff]/60 hover:text-[#00ff66]" aria-label={soundEnabled ? "Mute sound effects" : "Unmute sound effects"}>
                {soundEnabled ? <FiVolume2 size={14} /> : <FiVolumeX size={14} />}
              </button>
            </div>
          </div>
          
          {/* Header */}
          <div className="border-b border-[#1A2A3A] bg-[#05070A]/60 backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="font-mono text-[10px] sm:text-xs leading-tight border border-[#00f0ff]/30 bg-black/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded">
                <div className="text-[#00f0ff]">ENTER PASSWORD: <span className="text-[#00ff66] neon-text">*****</span></div>
                <div className="text-red-500 neon-text">ACCESS GRANTED</div>
                <div className="text-white font-bold tracking-wider text-xs sm:text-sm mt-0.5">BruteforceScannerR</div>
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-sm sm:text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#00ff66] to-[#00f0ff] glitch neon-text">BRUTEFORCE</div>
                <div className="text-[8px] sm:text-[9px] text-[#00f0ff]/50 tracking-widest uppercase">Recon Framework v2</div>
              </div>
              {scanning && (
                <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2 bg-[#00ff66]/10 border border-[#00ff66]/50 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1 border-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping"/>
                  <span className="text-[10px] sm:text-xs text-[#00ff66] font-mono tracking-widest neon-text">LIVE</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div className="hidden md:flex gap-1">
                {[["dashboard","📊"],["sni","📡"],["recon","🔍"],["proxy","🧪"],["ssl","🔒"]].map(([t,l])=>(
                  <button key={t} onClick={()=>setTab(t)} className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs tracking-wider transition-all ${tab===t?"bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40 shadow-lg neon-text":"text-[#8899aa] hover:text-[#00f0ff] hover:bg-[#00f0ff]/5"}`} aria-label={`Switch to ${t} tab`}>
                    <span className="hidden sm:inline">{t==="dashboard"?"Dashboard":t.toUpperCase()}</span><span className="sm:hidden">{l}</span>
                  </button>
                ))}
              </div>
              <div className="md:hidden">
                <select value={tab} onChange={e=>setTab(e.target.value)} className="bg-black/60 border border-[#1A2A3A] rounded-lg px-2 py-1 text-[10px] text-[#00f0ff] focus:outline-none" aria-label="Select tab">
                  <option value="dashboard">📊</option><option value="sni">📡</option><option value="recon">🔍</option><option value="proxy">🧪</option><option value="ssl">🔒</option>
                </select>
              </div>
              <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="ml-1 sm:ml-2 p-1.5 sm:p-2 rounded-lg bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 text-[#00f0ff]/60 hover:text-[#00f0ff] transition" aria-label="Toggle theme">
                {theme==='dark'?<FiSun size={14}/>:<FiMoon size={14}/>}
              </button>
            </div>
          </div>
          {scanning && <ProgressBar pct={tab==="sni"?(sniResults.length/Math.max(1,sniTotal)*100):reconProgress} color="cyan"/>}
          
          <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-5">
            {/* ===== DASHBOARD TAB ===== */}
            {tab === "dashboard" && (
              <div className="space-y-5">
                <MetricsPanel aps={scanMetrics.aps} totalAttempts={scanMetrics.total} elapsed={scanMetrics.elapsed} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-[#0A0F18]/80 backdrop-blur-sm border border-[#1A2A3A] rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-[#00ff66] rounded-full shadow-[0_0_8px_#00ff66]" /><h3 className="text-sm font-bold text-[#00f0ff] tracking-wider neon-text">LIVE ATTEMPTS</h3></div>
                    <AttemptGraph dataPoints={graphData} />
                  </div>
                  <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-5" />
                    <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]" /><h3 className="text-sm font-bold text-[#00ff66] tracking-wider neon-text">TERMINAL LOG</h3></div>
                    <TerminalLog logs={terminalLogs} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="SNI Scans" value={stats.sniScans} color="cyan" icon={<FiShield/>}/>
                  <StatCard label="Recon Scans" value={stats.reconScans} color="purple" icon={<FiGlobe/>}/>
                  <StatCard label="Proxies Found" value={stats.proxiesFound} color="green" icon={<FiZap/>}/>
                  <StatCard label="Last Scan" value={stats.lastScan ? new Date(stats.lastScan).toLocaleDateString() : "—"} color="yellow" icon={<FiActivity/>}/>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[["sni", "SNI Scanner", <FiShield size={20} />, "cyan"], ["recon", "Recon", <FiGlobe size={20} />, "purple"], ["proxy", "Proxy Tester", <FiZap size={20} />, "green"], ["ssl", "SSL Scanner", <FiActivity size={20} />, "red"]].map(([t, label, icon]) => (
                    <button key={t} onClick={() => setTab(t)} className="group relative overflow-hidden rounded-xl border border-[#1A2A3A] bg-[#0A0F18] p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_#00ff6630] hover:border-[#00ff66]/50">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className="relative z-10 flex items-center gap-3 text-[#00f0ff] group-hover:text-[#00ff66] transition-colors">
                        <div className="p-2 rounded-lg bg-[#05070A] border border-[#1A2A3A] group-hover:border-[#00ff66]/50">{icon}</div>
                        <span className="font-mono text-sm font-bold tracking-wider">{label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ===== SNI TAB ===== */}
            {tab === "sni" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[#0A0F18]/80 backdrop-blur-sm border border-[#1A2A3A] rounded-xl p-5 shadow-lg">
                      <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]" /><h3 className="text-xs font-bold text-[#00f0ff] tracking-widest uppercase">Domain Preset</h3></div>
                      <div className="flex flex-wrap gap-1.5 mb-4 max-h-40 overflow-y-auto p-1">
                        {Object.entries(PRESET_GROUPS).map(([name, domains]) => (
                          <button key={name} onClick={() => { setSniPreset(name); setSniCustomText(""); }} className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono transition-all border ${sniPreset === name && !sniCustomText ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/50 shadow-[0_0_8px_#00ff6630]" : "bg-[#05070A] text-[#8899aa] border-[#1A2A3A] hover:border-[#00f0ff]/50 hover:text-[#00f0ff]"}`}>{name} <span className="text-[#00f0ff]/60 ml-1">({domains.length})</span></button>
                        ))}
                      </div>
                      {!sniCustomText && (
                        <div className="bg-[#05070A] border border-[#1A2A3A] rounded-lg p-3 max-h-32 overflow-y-auto mb-4 font-mono text-[10px]">
                          <div className="text-[#00f0ff]/50 mb-1">$ ls -la targets/</div>
                          <div className="flex flex-wrap gap-1">{(PRESET_GROUPS[sniPreset] || []).slice(0,20).map(d=><span key={d} className="text-[#00ff66] bg-[#00ff66]/5 px-1.5 py-0.5 rounded border border-[#1A2A3A]">{d}</span>)}</div>
                        </div>
                      )}
                      <div className="mb-4"><div className="text-[10px] text-[#00f0ff]/60 uppercase mb-1.5">Or paste custom list</div><textarea value={sniCustomText} onChange={e=>setSniCustomText(e.target.value)} rows={3} placeholder="moya.app&#10;nofunds.mtn.co.za&#10;..." className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-4 py-3 text-xs font-mono text-[#00ff66] placeholder-[#8899aa]/30 focus:border-[#00ff66] focus:shadow-[0_0_10px_#00ff6630] resize-none"/></div>
                      <button onClick={launchSNI} disabled={sniStatus==="running"} className="relative w-full py-3 rounded-lg font-bold tracking-widest text-sm uppercase overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed"><div className="absolute inset-0 bg-gradient-to-r from-[#00cc66] to-[#00994d] transition-all duration-300 group-hover:scale-105"/><div className="absolute inset-0 bg-[#00ff66] opacity-0 group-hover:opacity-20 transition-opacity"/><div className="absolute top-0 left-0 right-0 h-0.5 bg-white/50 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"/><span className="relative z-10 flex items-center justify-center gap-2 text-white">{sniStatus==="running"?<><span className="animate-spin">⟳</span> TESTING SNIs...</>:<>▶ BRUTEFORCE SNI</>}</span></button>
                      {sniError && <div className="text-xs text-red-400 mt-2 font-mono">! {sniError}</div>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#0A0F18]/80 backdrop-blur-sm border border-[#1A2A3A] rounded-xl p-5 shadow-lg">
                      <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-[#ffb347] rounded-full shadow-[0_0_8px_#ffb347]"/><h3 className="text-xs font-bold text-[#ffb347] tracking-widest uppercase">Options</h3></div>
                      <div className="space-y-4"><div><label className="text-[10px] text-[#8899aa] uppercase tracking-wider block mb-1">Target IP</label><input value={sniTargetIP} onChange={e=>setSniTargetIP(e.target.value)} placeholder="Auto-resolve" className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-3 py-2 text-xs font-mono text-[#00f0ff] placeholder-[#8899aa]/30 focus:border-[#00ff66]"/></div><div><label className="text-[10px] text-[#8899aa] uppercase tracking-wider block mb-1">Port</label><input value={sniPort} onChange={e=>setSniPort(e.target.value)} className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-3 py-2 text-xs font-mono text-[#00f0ff]"/></div><div className="space-y-2">{[[sniProbeHTTP,setSniProbeHTTP,"HTTP banner"],[sniProbeGeo,setSniProbeGeo,"GeoIP lookup"]].map(([val,set,label],i)=>(<label key={i} className="flex items-center gap-3 cursor-pointer group"><div onClick={()=>set(v=>!v)} className={`w-9 h-5 rounded-full transition-all relative border ${val?"bg-[#00ff66]/20 border-[#00ff66]":"bg-[#05070A] border-[#1A2A3A]"}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${val?"left-4 bg-[#00ff66] shadow-[0_0_8px_#00ff66]":"left-0.5 bg-[#8899aa]"}`}/></div><span className="text-xs text-[#8899aa] group-hover:text-[#00f0ff] transition">{label}</span></label>))}</div></div>
                    </div>
                    {sniStatus!=="idle"&&(<div className="space-y-2"><StatCard label="Working SNIs" value={sniResults.length} color="cyan" icon="✓"/><StatCard label="IPs Tested" value={[...new Set(sniResults.map(r=>r.ip))].length} color="cyan" icon="🌐"/></div>)}
                  </div>
                </div>
                {sniDisplayed.length>0&&(
                  <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 border-b border-[#1A2A3A] bg-[#0A0F18] flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-3"><span className="text-[#00ff66] font-mono text-sm font-bold neon-text">{sniDisplayed.length} WORKING</span><input value={sniFilter} onChange={e=>setSniFilter(e.target.value)} placeholder="filter..." className="bg-[#05070A] border border-[#1A2A3A] rounded-lg px-3 py-1 text-xs font-mono text-[#00f0ff] w-40 focus:border-[#00ff66]"/></div><button className="px-3 py-1.5 bg-[#00ff66]/5 hover:bg-[#00ff66]/10 rounded-lg text-xs text-[#00ff66] border border-[#1A2A3A] transition">⬇ CSV</button></div>
                    <div className="overflow-x-auto"><table className="w-full text-xs font-mono"><thead className="bg-[#0A0F18] text-[#00f0ff]/60 uppercase tracking-wider border-b border-[#1A2A3A]"><tr><th className="w-4 pl-4"/><SortableHeader field="sni" currentField={sniSortField} setField={setSniSortField} asc={sniSortAsc} setAsc={setSniSortAsc}>SNI Host</SortableHeader><th className="px-3 py-2 text-left">IP:Port</th><SortableHeader field="http" currentField={sniSortField} setField={setSniSortField} asc={sniSortAsc} setAsc={setSniSortAsc}>Status</SortableHeader><th className="px-3 py-2 text-left">Title</th><th className="px-3 py-2 text-left">Country</th><th className="px-3 py-2 text-left">Time</th><th className="px-3 py-2 text-left">Result</th><th className="w-4"/></tr></thead>
                    <tbody>{sniStatus==="running" && sniResults.length===0 ? Array.from({length:5}).map((_,i)=><SkeletonRow key={i}/>) : sniDisplayed.map((r,i)=>(<tr key={`${r.sni}-${r.ip}-${r.port}-${i}`} className="border-b border-[#1A2A3A]/50 hover:bg-[#00ff66]/5 transition group"><td className="pl-4 py-2"><div className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_6px_#00ff66]"/></td><td className="px-3 py-2 text-[#00f0ff] flex items-center gap-2"><span className="truncate max-w-[150px]">{r.sni}</span><button onClick={()=>copyToClipboard(r.sni,'SNI copied')} className="opacity-0 group-hover:opacity-100 transition" aria-label="Copy SNI"><FiCopy size={12} className="text-[#8899aa] hover:text-[#00ff66]"/></button></td><td className="px-3 py-2 text-[#8899aa]">{r.ip}:{r.port}</td><td className="px-3 py-2">{r.http?.status?<span className={r.http.status<300?"text-[#00ff66]":"text-[#ffb347]"}>{r.http.status}</span>:"—"}</td><td className="px-3 py-2 text-[#8899aa] max-w-[160px] truncate">{r.http?.title||"—"}</td><td className="px-3 py-2 text-[#8899aa]">{FLAGS[r.geo?.country]||"🌍"} {r.geo?.country||"—"}</td><td className="px-3 py-2 text-[#8899aa] text-[10px]">{new Date(r.timestamp).toLocaleTimeString()}</td><td className="px-3 py-2"><Chip color="green" glow>✓</Chip></td><td className="px-1 py-2"/></tr>))}</tbody></table></div>
                  </div>
                )}
              </>
            )}

            {/* ===== RECON TAB ===== */}
            {tab === "recon" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 bg-[#0A0F18]/80 backdrop-blur-sm border border-[#1A2A3A] rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-[#a855f7] rounded-full shadow-[0_0_8px_#a855f7]"/><h3 className="text-xs font-bold text-[#a855f7] tracking-widest uppercase">Target Domains</h3></div>
                    <textarea value={reconDomains} onChange={e=>setReconDomains(e.target.value)} rows={4} placeholder="mtn.co.za&#10;vodacom.co.za&#10;moya.app" className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-4 py-3 text-xs font-mono text-[#00ff66] placeholder-[#8899aa]/30 focus:border-[#a855f7] focus:shadow-[0_0_10px_#a855f730] resize-none mb-4"/>
                    <button onClick={launchRecon} disabled={reconStatus==="running"} className="relative w-full py-3 rounded-lg font-bold tracking-widest text-sm uppercase overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed"><div className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#7e22ce] transition-all duration-300 group-hover:scale-105"/><div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"/><div className="absolute top-0 left-0 right-0 h-0.5 bg-white/50 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"/><span className="relative z-10 flex items-center justify-center gap-2 text-white">{reconStatus==="running"?<><span className="animate-spin">⟳</span> SCANNING...</>:<>▶ LAUNCH RECON</>}</span></button>
                    {reconError && <div className="text-xs text-red-400 mt-2 font-mono">! {reconError}</div>}
                  </div>
                  <div className="bg-[#0A0F18]/80 backdrop-blur-sm border border-[#1A2A3A] rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-[#ffb347] rounded-full shadow-[0_0_8px_#ffb347]"/><h3 className="text-xs font-bold text-[#ffb347] tracking-widest uppercase">Port Profile</h3></div>
                    <div className="grid grid-cols-2 gap-2 mb-4">{Object.keys(PORT_PROFILES).map(k=>(<button key={k} onClick={()=>setReconProfile(k)} className={`py-2 rounded-lg text-[10px] sm:text-xs uppercase font-mono transition border ${reconProfile===k?"bg-[#ffb347]/10 text-[#ffb347] border-[#ffb347]/50":"bg-[#05070A] text-[#8899aa] border-[#1A2A3A] hover:border-[#ffb347]/50 hover:text-[#ffb347]"}`}>{k}</button>))}</div>
                    <div className="bg-[#05070A] border border-[#1A2A3A] rounded-lg p-3 font-mono text-[10px] text-[#00ff66]">{PORT_PROFILES[reconProfile]}</div>
                  </div>
                </div>
                {reconLive.length>0&&(<div className="grid grid-cols-2 sm:grid-cols-5 gap-3"><StatCard label="Live" value={reconLive.length} color="cyan"/><StatCard label="Highlights" value={reconLive.filter(r=>r.highlight).length} color="red"/><StatCard label="Proxies" value={reconLive.filter(r=>r.proxy_ok).length} color="green"/><StatCard label="Titled" value={reconLive.filter(r=>r.http?.title).length} color="purple"/><StatCard label="GeoMapped" value={reconLive.filter(r=>r.geo?.country).length} color="cyan"/></div>)}
                {reconDisplayed.length>0&&(
                  <div className="bg-[#05070A] border border-[#1A2A3A] rounded-xl overflow-hidden shadow-lg">
                    <div className="px-4 py-3 border-b border-[#1A2A3A] bg-[#0A0F18] flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><input value={reconFilter} onChange={e=>setReconFilter(e.target.value)} placeholder="filter results..." className="bg-[#05070A] border border-[#1A2A3A] rounded-lg px-3 py-1 text-xs font-mono text-[#00f0ff] w-48 focus:border-[#a855f7]"/><button onClick={()=>setShowHighlights(v=>!v)} className={`px-3 py-1 rounded-lg text-[10px] sm:text-xs font-mono transition border ${showHighlights?"bg-red-500/10 text-red-400 border-red-500/50":"bg-[#05070A] text-[#8899aa] border-[#1A2A3A] hover:border-[#00f0ff]/50"}`}>🔴 Highlights</button></div><button className="px-3 py-1.5 bg-[#a855f7]/5 hover:bg-[#a855f7]/10 rounded-lg text-xs text-[#a855f7] border border-[#1A2A3A] transition">⬇ CSV</button></div>
                    <div className="overflow-x-auto"><table className="w-full text-xs font-mono"><thead className="bg-[#0A0F18] text-[#00f0ff]/60 uppercase tracking-wider border-b border-[#1A2A3A]"><tr><th className="w-3 pl-3"/><SortableHeader field="score" currentField={reconSortField} setField={setReconSortField} asc={reconSortAsc} setAsc={setReconSortAsc}>Score</SortableHeader><SortableHeader field="domain" currentField={reconSortField} setField={setReconSortField} asc={reconSortAsc} setAsc={setReconSortAsc}>Domain</SortableHeader><th className="px-3 py-2 text-left">IP</th><th className="px-3 py-2 text-left">Ports</th><th className="px-3 py-2 text-left">Proxy</th><th className="px-3 py-2 text-left">Title</th><th className="px-3 py-2 text-left">Geo</th><th className="px-3 py-2 text-left">HTTP</th><th className="w-4"/></tr></thead>
                    <tbody>{reconStatus==="running" && reconResults.length===0 ? Array.from({length:3}).map((_,i)=><SkeletonRow key={i}/>) : reconDisplayed.map((r,i)=>(<tr key={r.domain+i} className="border-b border-[#1A2A3A]/50 hover:bg-[#a855f7]/5 transition group"><td className="pl-3 py-2"><div className={`w-1.5 h-1.5 rounded-full ${r.highlight?"bg-red-400 shadow-[0_0_6px_#ff3333]":"bg-[#00f0ff]/40"}`}/></td><td className="px-3 py-2"><ScoreDot score={r.score}/></td><td className="px-3 py-2 text-[#00f0ff] flex items-center gap-2"><span className="truncate max-w-[150px]">{r.domain}</span><button onClick={()=>copyToClipboard(r.domain,'Domain copied')} className="opacity-0 group-hover:opacity-100 transition" aria-label="Copy domain"><FiCopy size={12} className="text-[#8899aa] hover:text-[#a855f7]"/></button></td><td className="px-3 py-2 text-[#8899aa]">{(r.ips||[])[0]||"—"}</td><td className="px-3 py-2"><div className="flex gap-1 flex-wrap">{(r.open_ports||[]).map(p=><RiskBadge key={p} port={p}/>)}</div></td><td className="px-3 py-2">{r.proxy_ok?<Chip color="green" glow>⚡</Chip>:<span className="text-[#8899aa]/20">—</span>}</td><td className="px-3 py-2 text-[#8899aa] max-w-[160px] truncate">{r.http?.title||"—"}</td><td className="px-3 py-2 text-[#8899aa]">{FLAGS[r.geo?.country]||"🌍"} {r.geo?.city||r.geo?.country||"—"}</td><td className="px-3 py-2">{r.http?.status?<span className={r.http.status<300?"text-[#00ff66]":"text-[#ffb347]"}>{r.http.status}</span>:"—"}</td><td className="px-1"/></tr>))}</tbody></table></div>
                  </div>
                )}
              </>
            )}

            {/* ===== PROXY TAB ===== */}
            {tab === "proxy" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-[#0A0F18]/80 backdrop-blur-sm border border-[#1A2A3A] rounded-xl p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-[#10b981] rounded-full shadow-[0_0_8px_#10b981]"/><h3 className="text-xs font-bold text-[#10b981] tracking-widest uppercase">Proxy Tester (Multi‑Port)</h3></div>
                  <div className="space-y-4"><div><label className="text-[10px] text-[#8899aa] uppercase tracking-wider block mb-1">Proxy Host</label><input value={proxyHost} onChange={e=>setProxyHost(e.target.value)} placeholder="e.g., api.vodacom.co.za" className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-4 py-2 text-xs font-mono text-[#00f0ff] placeholder-[#8899aa]/30 focus:border-[#10b981]"/></div><div><label className="text-[10px] text-[#8899aa] uppercase tracking-wider block mb-1">Ports (comma‑separated)</label><input value={proxyPort} onChange={e=>setProxyPort(e.target.value)} placeholder="3128,8888,9090,1080,8118" className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-4 py-2 text-xs font-mono text-[#00f0ff] placeholder-[#8899aa]/30 focus:border-[#10b981]"/></div><div><label className="text-[10px] text-[#8899aa] uppercase tracking-wider block mb-1">Target URL</label><input value={proxyTarget} onChange={e=>setProxyTarget(e.target.value)} className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-4 py-2 text-xs font-mono text-[#00f0ff] placeholder-[#8899aa]/30 focus:border-[#10b981]"/></div>
                  <button onClick={testProxy} disabled={proxyLoading} className="relative w-full py-3 rounded-lg font-bold tracking-widest text-sm uppercase overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed"><div className="absolute inset-0 bg-gradient-to-r from-[#10b981] to-[#059669] transition-all duration-300 group-hover:scale-105"/><div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"/><div className="absolute top-0 left-0 right-0 h-0.5 bg-white/50 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"/><span className="relative z-10 flex items-center justify-center gap-2 text-white">{proxyLoading?<><span className="animate-spin">⟳</span> TESTING...</>:<>▶ TEST ALL PORTS</>}</span></button></div>
                  {proxyResult&&(<div className="mt-4 space-y-2 max-h-80 overflow-y-auto"><div className="text-xs text-[#00f0ff]/60 font-mono">Results for {proxyResult.host}:</div>{proxyResult.results?.map((r,i)=>(<div key={i} className={`p-3 rounded-lg border ${r.success?"bg-[#10b981]/5 border-[#10b981]/30":"bg-[#ef4444]/5 border-[#ef4444]/30"}`}><div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${r.success?"bg-[#10b981]":"bg-[#ef4444]"}`}/><span className="text-xs font-mono text-[#00f0ff]">Port {r.port}</span>{r.status&&<span className="text-[10px] text-[#8899aa]">({r.status})</span>}</div>{r.success&&r.data?<pre className="text-[#00ff66] text-[10px] mt-1 overflow-x-auto font-mono">{JSON.stringify(r.data,null,2)}</pre>:<div className="text-[10px] text-[#ef4444] mt-1 font-mono">{r.error||'Failed'}</div>}</div>))}</div>)}
                  {proxyResult?.error && <div className="text-[#ef4444] mt-4">{proxyResult.error}</div>}
                </div>
                <div className="bg-[#0A0F18]/80 backdrop-blur-sm border border-[#1A2A3A] rounded-xl p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]"/><h3 className="text-xs font-bold text-[#00f0ff] tracking-widest uppercase">How to Use</h3></div>
                  <ol className="text-xs text-[#8899aa] space-y-2 list-decimal list-inside font-mono"><li>Enter proxy host from Recon results.</li><li>Specify ports to test.</li><li>Click "Test All Ports".</li><li className="text-[#ffb347]">⚠️ Only test on authorized networks.</li></ol>
                </div>
              </div>
            )}

            {/* ===== SSL TAB ===== */}
            {tab === "ssl" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-[#0A0F18]/80 backdrop-blur-sm border border-[#1A2A3A] rounded-xl p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-[#ef4444] rounded-full shadow-[0_0_8px_#ef4444]"/><h3 className="text-xs font-bold text-[#ef4444] tracking-widest uppercase">SSL Certificate Scanner</h3></div>
                  <div className="space-y-4"><div><label className="text-[10px] text-[#8899aa] uppercase tracking-wider block mb-1">Domain</label><input value={sslDomain} onChange={e=>setSslDomain(e.target.value)} placeholder="e.g., arenaplus.co.za" className="w-full bg-[#05070A] border border-[#1A2A3A] rounded-lg px-4 py-2 text-xs font-mono text-[#00f0ff] placeholder-[#8899aa]/30 focus:border-[#ef4444]"/></div>
                  <button onClick={scanSSL} disabled={sslLoading} className="relative w-full py-3 rounded-lg font-bold tracking-widest text-sm uppercase overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed"><div className="absolute inset-0 bg-gradient-to-r from-[#ef4444] to-[#b91c1c] transition-all duration-300 group-hover:scale-105"/><div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"/><div className="absolute top-0 left-0 right-0 h-0.5 bg-white/50 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"/><span className="relative z-10 flex items-center justify-center gap-2 text-white">{sslLoading?<><span className="animate-spin">⟳</span> SCANNING...</>:<>▶ SCAN SSL</>}</span></button></div>
                  {sslResult&&(<div className={`mt-4 p-4 rounded-lg border ${sslResult.success?"bg-[#10b981]/5 border-[#10b981]/30":"bg-[#ef4444]/5 border-[#ef4444]/30"}`}>{sslResult.success?<><div className="text-xs text-[#00f0ff] font-mono mb-2"><span className="text-[#8899aa]">Domain:</span> {sslResult.domain}</div><div className="text-xs text-[#00f0ff] font-mono mb-1"><span className="text-[#8899aa]">Issuer:</span> {sslResult.issuer}</div><div className="text-xs text-[#00f0ff] font-mono mb-1"><span className="text-[#8899aa]">Subject CN:</span> {sslResult.subjectCN}</div><div className="text-xs text-[#00f0ff] font-mono mb-1"><span className="text-[#8899aa]">Valid:</span> {sslResult.validFrom} → {sslResult.validTo}</div>{sslResult.daysRemaining!==null&&(<div className="text-xs font-mono mt-2"><span className="text-[#8899aa]">Days left:</span> <span className={sslResult.daysRemaining<30?"text-[#ef4444]":sslResult.daysRemaining<90?"text-[#ffb347]":"text-[#10b981]"}>{sslResult.daysRemaining}</span></div>)}</>:<div className="text-xs text-[#ef4444] font-mono">{sslResult.error}</div>}</div>)}
                </div>
                <div className="bg-[#0A0F18]/80 backdrop-blur-sm border border-[#1A2A3A] rounded-xl p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]"/><h3 className="text-xs font-bold text-[#00f0ff] tracking-widest uppercase">Certificate Details</h3></div>
                  <p className="text-xs text-[#8899aa] font-mono">Enter a domain to check its SSL certificate validity, issuer, and expiration.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#05070A]/90 border-t border-[#1A2A3A] backdrop-blur-xl flex justify-around py-2 z-40">
          {[["dashboard","📊"],["sni","📡"],["recon","🔍"],["proxy","🧪"],["ssl","🔒"]].map(([t,icon])=>(
            <button key={t} onClick={()=>setTab(t)} className={`p-3 rounded-lg ${tab===t?"bg-[#00ff66]/10 text-[#00ff66] neon-text":"text-[#8899aa]"}`} aria-label={`Switch to ${t} tab`}>{icon}</button>
          ))}
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
