'use client';

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { apiFetch } from '@/lib/api';
import { 
  ShieldAlert, AlertCircle, AlertTriangle, Shield, CheckCircle2, 
  Globe, Cpu, Layers, Activity, Clock, Terminal, ChevronRight,
  TrendingUp, Radio, RefreshCw, Key, ShieldCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LiveEvent {
  time: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface AttackerInfo {
  ip: string;
  country: string;
  countryCode: string;
  asn: string;
  reputation: number;
  vpn: boolean;
  tor: boolean;
}

const ATTACKER_POOL: AttackerInfo[] = [
  { ip: '185.72.144.31', country: 'Russia', countryCode: 'RU', asn: 'AS12389', reputation: 91, vpn: true, tor: true },
  { ip: '45.138.89.102', country: 'Netherlands', countryCode: 'NL', asn: 'AS20473', reputation: 85, vpn: true, tor: false },
  { ip: '198.51.100.72', country: 'China', countryCode: 'CN', asn: 'AS4134', reputation: 78, vpn: false, tor: false },
  { ip: '109.202.107.5', country: 'Ukraine', countryCode: 'UA', asn: 'AS13188', reputation: 64, vpn: false, tor: false },
  { ip: '185.220.101.43', country: 'Germany', countryCode: 'DE', asn: 'AS200651', reputation: 95, vpn: true, tor: true },
  { ip: '82.102.23.14', country: 'United Kingdom', countryCode: 'GB', asn: 'AS12576', reputation: 42, vpn: true, tor: false }
];

const MITRE_TECHNIQUES = [
  { id: 'T1110', name: 'Brute Force', severity: 'HIGH', desc: 'Adversaries may use brute force techniques to gain access to accounts when passwords are unknown.' },
  { id: 'T1078', name: 'Valid Accounts', severity: 'MEDIUM', desc: 'Adversaries may obtain and abuse credentials of existing accounts as a means of gaining initial access.' },
  { id: 'T1499', name: 'Endpoint Denial of Service', severity: 'CRITICAL', desc: 'Adversaries may perform endpoint denial of service attacks to disrupt availability of systems.' },
  { id: 'T1071', name: 'Application Layer Protocol', severity: 'LOW', desc: 'Adversaries may communicate using application layer protocols to avoid detection.' }
];

export default function Threats() {
  const [loading, setLoading] = useState(false);
  
  // Real-time events state
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Attack Origin state
  const [attacker, setAttacker] = useState<AttackerInfo>(ATTACKER_POOL[0]);

  // AI Typing Effect state
  const [assessmentText, setAssessmentText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [targetAssessment, setTargetAssessment] = useState("Potential brute force campaign detected. Attack pattern resembles credential stuffing behavior. Recommend immediate hybrid key rotation.");

  const [ollamaStatus, setOllamaStatus] = useState('ONLINE (OLLAMA L3)');
  const [latestThreat, setLatestThreat] = useState<any>(null);
  const [threatLogs, setThreatLogs] = useState<any[]>([]);

  // Counter states for metrics
  const [metrics, setMetrics] = useState({
    events: 4320,
    blocked: 120,
    sessions: 48,
    intelHits: 15,
    qsKeys: 48,
    confidence: 90
  });

  // MITRE interactive states
  const [selectedMitre, setSelectedMitre] = useState<string | null>(null);

  // Chart data
  const pieData = [
    { name: "Brute Force", value: 42, color: "#ef4444" },
    { name: "Credential Stuffing", value: 23, color: "#f97316" },
    { name: "DDoS", value: 18, color: "#f59e0b" },
    { name: "Session Hijacking", value: 10, color: "#00e5ff" },
    { name: "Insider Threat", value: 7, color: "#00ff9d" }
  ];

  // Recommendations state
  const [recommendations, setRecommendations] = useState([
    { id: 1, action: "Rotate Session Keys", priority: "HIGH", status: "PENDING" },
    { id: 2, action: "Block Source IP", priority: "HIGH", status: "PENDING" },
    { id: 3, action: "Enable Multi-Factor Authentication", priority: "MEDIUM", status: "COMPLETED" },
    { id: 4, action: "Increase Monitoring Frequency", priority: "LOW", status: "COMPLETED" },
    { id: 5, action: "Terminate Suspicious Sessions", priority: "HIGH", status: "PENDING" }
  ]);

  // Fetch Ollama connection status and latest threats from backend
  useEffect(() => {
    const fetchStatusAndThreats = async () => {
      try {
        const statusData = await apiFetch('/ai/status');
        if (statusData) {
          if (statusData.connected) {
            setOllamaStatus(`ONLINE (${statusData.model.toUpperCase()})`);
          } else {
            setOllamaStatus("OFFLINE (FALLBACK RULES)");
          }
        }
      } catch (err) {
        console.error("Failed to fetch Ollama status:", err);
      }

      try {
        const feedData = await apiFetch('/threats/feed');
        if (feedData && feedData.length > 0) {
          setThreatLogs(feedData);
          const latest = feedData[0];
          setLatestThreat(latest);
          if (latest.reasoning) {
            setTargetAssessment(latest.reasoning);
          }
        }
      } catch (err) {
        console.error("Failed to fetch threat feed:", err);
      }
    };

    fetchStatusAndThreats();
    const interval = setInterval(fetchStatusAndThreats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Setup initial events and intervals
  useEffect(() => {
    // Generate initial live events
    const initialEvents: LiveEvent[] = [
      { time: '15:20:01', message: 'Failed Login Attempt', severity: 'MEDIUM' },
      { time: '15:20:04', message: 'ML-KEM Handshake Initiated', severity: 'LOW' },
      { time: '15:20:07', message: 'Suspicious Session Activity', severity: 'HIGH' },
      { time: '15:20:11', message: 'GeoIP Mismatch Detected', severity: 'HIGH' },
      { time: '15:20:14', message: 'High Authentication Failure Rate', severity: 'CRITICAL' },
      { time: '15:20:19', message: 'Threat Analysis Triggered', severity: 'LOW' },
      { time: '15:20:22', message: 'Key Rotation Recommended', severity: 'MEDIUM' }
    ];
    setEvents(initialEvents);

    // Event generator interval (every 2-4 seconds)
    const eventMessages = [
      { message: 'Invalid API Signature Rejected', severity: 'HIGH' as const },
      { message: 'ML-KEM-768 Ciphertext Validated', severity: 'LOW' as const },
      { message: 'GeoIP Check: Non-standard ASN range', severity: 'MEDIUM' as const },
      { message: 'Host anomaly signature identified', severity: 'HIGH' as const },
      { message: 'Hybrid Key Exchange finalized', severity: 'LOW' as const },
      { message: 'Rapid rate limiting rule activated', severity: 'MEDIUM' as const },
      { message: 'Brute-force lockout rule triggered', severity: 'CRITICAL' as const },
      { message: 'Session keep-alive timeout', severity: 'LOW' as const },
      { message: 'Unauthorized config edit attempted', severity: 'CRITICAL' as const }
    ];

    const eventInterval = setInterval(() => {
      const randomMsg = eventMessages[Math.floor(Math.random() * eventMessages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setEvents(prev => {
        const next = [...prev, { time: timeStr, message: randomMsg.message, severity: randomMsg.severity }];
        if (next.length > 50) next.shift();
        return next;
      });
      // Increment total security events counter slightly
      setMetrics(prev => ({
        ...prev,
        events: prev.events + Math.floor(Math.random() * 3) + 1,
        sessions: prev.sessions + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0),
        qsKeys: prev.qsKeys + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 3000);

    // Attack origin rotator (every 10 seconds)
    const attackerInterval = setInterval(() => {
      const currentIdx = ATTACKER_POOL.findIndex(a => a.ip === attacker.ip);
      const nextIdx = (currentIdx + 1) % ATTACKER_POOL.length;
      setAttacker(ATTACKER_POOL[nextIdx]);
      setMetrics(prev => ({
        ...prev,
        intelHits: prev.intelHits + Math.floor(Math.random() * 2),
        blocked: prev.blocked + (Math.random() > 0.6 ? 1 : 0)
      }));
    }, 10000);

    return () => {
      clearInterval(eventInterval);
      clearInterval(attackerInterval);
    };
  }, [attacker]);

  // Handle typing animation when targetAssessment changes
  useEffect(() => {
    setAssessmentText('');
    setTypingIndex(0);
  }, [targetAssessment]);

  useEffect(() => {
    if (typingIndex < targetAssessment.length) {
      const timeout = setTimeout(() => {
        setAssessmentText(targetAssessment.substring(0, typingIndex + 1));
        setTypingIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, targetAssessment]);

  // Auto-scroll logic for Live Security Events
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  // Metric Counter Animation Effect
  useEffect(() => {
    const targetMetrics = {
      events: 4382,
      blocked: 127,
      sessions: 52,
      intelHits: 18,
      qsKeys: 52,
      confidence: 94
    };

    const interval = setInterval(() => {
      setMetrics(prev => {
        const next = { ...prev };
        let done = true;
        (Object.keys(targetMetrics) as Array<keyof typeof targetMetrics>).forEach(key => {
          if (next[key] < targetMetrics[key]) {
            next[key] = Math.min(next[key] + Math.ceil((targetMetrics[key] - next[key]) / 10), targetMetrics[key]);
            done = false;
          }
        });
        if (done) clearInterval(interval);
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-500 border border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-500 border border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
      default: return 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30';
    }
  };

  const toggleRecommendation = (id: number) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          status: rec.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
        };
      }
      return rec;
    }));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-cyber-bg cyber-grid text-cyber-text-primary">
      <Navbar />

      <div className="flex-1 p-6 space-y-6 max-w-[1400px] mx-auto w-full">
        {/* Page Title & Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyber-border/80 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-cyber-text-primary flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-accent"></span>
              </span>
              AI Cybersecurity Shield Diagnostics
            </h1>
            <p className="text-xs text-cyber-text-secondary mt-1 font-mono uppercase tracking-widest">
              Live Threat intelligence matrix // local quantum security analyzer
            </p>
          </div>
          <div className="flex items-center gap-3 bg-cyber-card border border-cyber-border px-4 py-2 rounded-xl text-xs font-mono">
            <Radio className="w-4 h-4 text-cyber-accent animate-pulse" />
            <span className="text-cyber-text-secondary">SOC ENGINE:</span>
            <span className="text-cyber-accent font-bold">{ollamaStatus}</span>
          </div>
        </div>

        {/* Top SOC Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 font-mono">
          {[
            { label: 'Security Events', val: metrics.events.toLocaleString(), color: 'text-cyber-accent-blue', border: 'glow-accent-blue' },
            { label: 'Blocked Threats', val: metrics.blocked, color: 'text-cyber-accent-red', border: 'hover:shadow-[0_0_15px_rgba(255,59,48,0.15)]' },
            { label: 'Active Sessions', val: metrics.sessions, color: 'text-cyber-accent-yellow', border: '' },
            { label: 'Threat Intel Hits', val: metrics.intelHits, color: 'text-orange-500', border: '' },
            { label: 'Quantum-Safe Keys', val: metrics.qsKeys, color: 'text-cyber-accent', border: 'glow-accent' },
            { label: 'AI Confidence', val: `${metrics.confidence}%`, color: 'text-emerald-400', border: '' }
          ].map((m, i) => (
            <div key={i} className={`bg-cyber-card border border-cyber-border rounded-xl p-4 transition-all duration-300 ${m.border}`}>
              <span className="text-[10px] text-cyber-text-secondary uppercase tracking-wider block mb-1">
                {m.label}
              </span>
              <p className={`text-2xl font-bold ${m.color}`}>
                {m.val}
              </p>
            </div>
          ))}
        </div>

        {/* Row 1: Live Events + Attack Origin */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          {/* Live Events Stream */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden flex flex-col h-[400px]">
            <div className="flex justify-between items-center border-b border-cyber-border/80 pb-3 mb-4">
              <h3 className="text-cyber-accent text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyber-accent animate-pulse" />
                LIVE SECURITY EVENTS
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] text-cyber-text-muted">
                <span className="w-2 h-2 bg-cyber-accent rounded-full animate-ping" />
                STREAMING
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-2.5 pr-2 scrollbar-thin scrollbar-thumb-cyber-border"
            >
              {events.map((ev, idx) => (
                <div 
                  key={idx} 
                  className={`p-2.5 rounded border text-xs flex items-center justify-between transition-all duration-300 bg-cyber-bg/40 ${
                    ev.severity === 'CRITICAL' ? 'border-red-500/30 hover:border-red-500/60' :
                    ev.severity === 'HIGH' ? 'border-orange-500/30 hover:border-orange-500/60' :
                    ev.severity === 'MEDIUM' ? 'border-yellow-500/30 hover:border-yellow-500/60' :
                    'border-emerald-500/30 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-cyber-text-muted">[{ev.time}]</span>
                    <span className="text-cyber-text-primary font-bold">{ev.message}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${getSeverityBadgeColor(ev.severity)}`}>
                    {ev.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Attack Origin Analysis */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center border-b border-cyber-border/80 pb-3 mb-4">
              <h3 className="text-cyber-accent-blue text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyber-accent-blue" />
                ATTACK ORIGIN ANALYSIS
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] text-cyber-text-muted">
                <RefreshCw className="w-3.5 h-3.5 text-cyber-text-muted animate-spin" />
                ROTATING EVERY 10S
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-1">
              {/* Flag / Details */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-cyber-border/40 pb-2">
                  <span className="text-cyber-text-secondary uppercase">Source IP</span>
                  <span className="text-cyber-text-primary font-bold select-all">{attacker.ip}</span>
                </div>
                <div className="flex justify-between border-b border-cyber-border/40 pb-2">
                  <span className="text-cyber-text-secondary uppercase">Country</span>
                  <span className="text-cyber-text-primary font-bold flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-cyber-border/60 inline-block text-[8px] font-bold text-center leading-3 border border-cyber-border">
                      {attacker.countryCode}
                    </span>
                    {attacker.country}
                  </span>
                </div>
                <div className="flex justify-between border-b border-cyber-border/40 pb-2">
                  <span className="text-cyber-text-secondary uppercase">ASN</span>
                  <span className="text-cyber-text-primary font-bold">{attacker.asn}</span>
                </div>
                <div className="flex justify-between border-b border-cyber-border/40 pb-2">
                  <span className="text-cyber-text-secondary uppercase">Threat Score</span>
                  <span className="text-cyber-accent-red font-bold">{attacker.reputation}% Critical</span>
                </div>
                <div className="flex justify-between border-b border-cyber-border/40 pb-2">
                  <span className="text-cyber-text-secondary uppercase">VPN Detection</span>
                  <span className={`font-bold ${attacker.vpn ? 'text-cyber-accent-red' : 'text-cyber-text-muted'}`}>
                    {attacker.vpn ? 'DETECTED' : 'NONE'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-cyber-border/40 pb-2">
                  <span className="text-cyber-text-secondary uppercase">TOR Exit Node</span>
                  <span className={`font-bold ${attacker.tor ? 'text-cyber-accent-red' : 'text-cyber-text-muted'}`}>
                    {attacker.tor ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>

              {/* Graphic Radar Indicator */}
              <div className="flex flex-col items-center justify-center p-4 border border-cyber-border bg-cyber-bg/40 rounded-xl relative h-[220px]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-accent-red/5 via-transparent to-transparent pointer-events-none" />
                <div className="relative w-32 h-32 rounded-full border border-cyber-border flex items-center justify-center animate-pulse">
                  <div className="absolute w-24 h-24 rounded-full border border-cyber-accent-red/20" />
                  <div className="absolute w-16 h-16 rounded-full border border-cyber-border/60" />
                  <Globe className="w-10 h-10 text-cyber-accent-red animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="absolute w-2 h-2 bg-cyber-accent-red rounded-full top-6 right-8 animate-ping" />
                </div>
                <span className="text-[10px] text-cyber-accent-red font-bold mt-4 tracking-widest text-center">
                  WARNING: BRUTE-FORCE GEOLOCATION LOCKOUT ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: AI Reasoning + MITRE Mapping */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          {/* AI Threat Reasoning Panel */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center border-b border-cyber-border/80 pb-3 mb-4">
              <h3 className="text-cyber-accent text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-accent" />
                AI THREAT REASONING
              </h3>
              <div className="text-[10px] text-cyber-accent font-bold px-2 py-0.5 border border-cyber-accent/30 rounded bg-cyber-accent/10">
                {ollamaStatus.startsWith("ONLINE") ? "OLLAMA L3 AGENT" : "FALLBACK RULES"}
              </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Detected Indicators */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] text-cyber-text-secondary uppercase tracking-wider block mb-1">
                  Detected Anomaly Indicators:
                </span>
                {(latestThreat ? [
                  `Threat Score: ${Math.round(latestThreat.threat_score * 100)}%`,
                  `Severity classification: ${latestThreat.severity}`,
                  `Recommended action: ${latestThreat.action}`,
                  latestThreat.session_id ? `Target Session: ${latestThreat.session_id.substring(0, 12)}...` : 'Target: Global space'
                ] : [
                  'Failed login attempts exceeded threshold',
                  'Handshake frequency anomaly detected',
                  'Session creation velocity increased',
                  'Geo-location inconsistency detected'
                ]).map((ind, i) => (
                  <div key={i} className="flex items-center gap-2 text-cyber-accent-yellow">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyber-accent" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>

              {/* Confidence Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyber-text-secondary">AI CLASSIFICATION CONFIDENCE</span>
                  <span className="text-cyber-accent font-bold">
                    {latestThreat ? `${Math.round(latestThreat.threat_score * 100)}%` : '94%'}
                  </span>
                </div>
                <div className="w-full bg-cyber-bg h-2 rounded-full overflow-hidden border border-cyber-border">
                  <div 
                    className="bg-cyber-accent h-full rounded-full glow-accent transition-all duration-500" 
                    style={{ width: latestThreat ? `${Math.round(latestThreat.threat_score * 100)}%` : '94%' }}
                  />
                </div>
              </div>

              {/* Typed Reasoning Output */}
              <div className="bg-cyber-bg/70 border border-cyber-border p-3.5 rounded-lg text-xs min-h-[90px] flex flex-col justify-between relative overflow-hidden">
                <div className="text-cyber-text-secondary leading-relaxed font-sans">
                  <strong>Assessment:</strong> {assessmentText}
                  <span className="animate-pulse font-bold ml-0.5 text-cyber-accent">|</span>
                </div>
                <div className="text-[9px] text-cyber-text-muted mt-2 border-t border-cyber-border/40 pt-1 flex justify-between">
                  <span>MODEL: {ollamaStatus}</span>
                  <span>LATENCY: 145ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Mapping */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center border-b border-cyber-border/80 pb-3 mb-4">
              <h3 className="text-cyber-accent-blue text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyber-accent-blue" />
                MITRE ATT&CK MAPPING
              </h3>
              <span className="text-[10px] text-cyber-text-muted">CLICK FOR DETAILS</span>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MITRE_TECHNIQUES.map((tech) => (
                  <div
                    key={tech.id}
                    onClick={() => setSelectedMitre(selectedMitre === tech.id ? null : tech.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                      selectedMitre === tech.id 
                        ? 'bg-cyber-accent-blue/10 border-cyber-accent-blue' 
                        : 'bg-cyber-bg/40 border-cyber-border hover:border-cyber-border/100'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-cyber-accent-blue">{tech.id}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        tech.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                        tech.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                        tech.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-emerald-500/20 text-emerald-500'
                      }`}>
                        {tech.severity}
                      </span>
                    </div>
                    <div className="font-bold text-cyber-text-primary truncate">{tech.name}</div>
                    <div className="text-[10px] text-cyber-text-secondary mt-1 group-hover:text-cyber-text-primary transition-colors">
                      {selectedMitre === tech.id ? 'Click to close description' : 'Click to inspect description'}
                    </div>
                  </div>
                ))}
              </div>

              {/* MITRE Details Panel */}
              <div className="bg-cyber-bg/60 border border-cyber-border/80 p-3.5 rounded-lg text-xs min-h-[110px] flex flex-col justify-center">
                {selectedMitre ? (
                  <div>
                    <h5 className="font-bold text-cyber-accent-blue mb-1">
                      {selectedMitre} - {MITRE_TECHNIQUES.find(t => t.id === selectedMitre)?.name}
                    </h5>
                    <p className="text-cyber-text-secondary leading-relaxed text-[11px]">
                      {MITRE_TECHNIQUES.find(t => t.id === selectedMitre)?.desc}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-cyber-text-muted py-4">
                    [NO MITRE TECHNIQUE SELECTED]
                    <br />
                    Select a badge above to review detailed adversarial technique profiles.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Recommendations + Threat Distribution Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          {/* Security Recommendations Panel */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center border-b border-cyber-border/80 pb-3 mb-4">
              <h3 className="text-cyber-accent text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-accent" />
                RECOMMENDED ACTIONS
              </h3>
              <span className="text-[10px] text-cyber-text-muted">CLICK TO TOGGLE STATUS</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-cyber-border">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => toggleRecommendation(rec.id)}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all duration-300 ${
                    rec.status === 'COMPLETED'
                      ? 'border-emerald-500/20 bg-emerald-950/5 text-cyber-text-secondary hover:border-emerald-500/40'
                      : 'border-cyber-border bg-cyber-bg/30 hover:border-cyber-accent-yellow/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                      rec.status === 'COMPLETED' 
                        ? 'border-cyber-accent bg-cyber-accent text-cyber-bg' 
                        : 'border-cyber-accent-yellow'
                    }`}>
                      {rec.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                    <span className={`font-bold ${rec.status === 'COMPLETED' ? 'line-through text-cyber-text-muted' : 'text-cyber-text-primary'}`}>
                      {rec.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      rec.priority === 'HIGH' ? 'bg-red-500/20 text-red-500' :
                      rec.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {rec.priority}
                    </span>
                    <span className={`text-[10px] font-bold ${rec.status === 'COMPLETED' ? 'text-cyber-accent' : 'text-cyber-accent-yellow'}`}>
                      {rec.status === 'COMPLETED' ? 'DONE' : 'PENDING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Distribution Pie Chart */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center border-b border-cyber-border/80 pb-3 mb-4">
              <h3 className="text-cyber-accent-blue text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyber-accent-blue" />
                THREAT DISTRIBUTION
              </h3>
              <span className="text-[10px] text-cyber-text-muted">ACTIVE ASSESSMENTS</span>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-full h-[240px] sm:w-[60%] text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      animationDuration={800}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111a33', borderColor: '#1e2d5a', borderRadius: '8px' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custon Legend */}
              <div className="w-full sm:w-[40%] space-y-2">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs border-b border-cyber-border/30 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-cyber-text-secondary text-[11px]">{item.name}</span>
                    </div>
                    <span className="text-cyber-text-primary font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Quantum-Safe Security Status */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 font-mono relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-32 h-32 text-cyber-accent" />
          </div>
          <div className="flex justify-between items-center border-b border-cyber-border/80 pb-3 mb-4">
            <h3 className="text-cyber-accent text-sm font-bold tracking-wider uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyber-accent" />
              QUANTUM-SAFE SECURITY STATUS
            </h3>
            <span className="text-[10px] text-cyber-accent font-bold px-2 py-0.5 border border-cyber-accent/30 rounded bg-cyber-accent/10">
              DUAL HYBRID PROTECTION SYSTEM ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            {[
              { label: 'X25519 Protection', val: 'Active', desc: 'Standard Elliptic Curve Cryptography enabled.', ok: true },
              { label: 'ML-KEM-768 Protection', val: 'Active', desc: 'Post-Quantum Key Encapsulation Mechanism active.', ok: true },
              { label: 'Hybrid Security Mode', val: 'Enabled', desc: 'Simultaneous classical + post-quantum validation.', ok: true },
              { label: 'Quantum Risk Level', val: 'LOW', desc: 'Zero anomalies matched harvest-now-decrypt-later vectors.', ok: true }
            ].map((st, i) => (
              <div key={i} className="p-4 bg-cyber-bg/40 border border-cyber-border/80 rounded-xl space-y-1">
                <span className="text-[10px] text-cyber-text-secondary uppercase">{st.label}</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />
                  <span className="text-sm font-bold text-cyber-accent">{st.val}</span>
                </div>
                <p className="text-[10px] text-cyber-text-muted mt-1 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
