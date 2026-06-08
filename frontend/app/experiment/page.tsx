'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Play, 
  CheckCircle, 
  Terminal, 
  Download, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Server, 
  Users, 
  Database, 
  Layers, 
  Globe, 
  AlertTriangle, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw 
} from 'lucide-react';

interface MetricState {
  clients: number;
  sessions: number;
  messages: number;
  threats: number;
  detections: number;
  rotations: number;
}

interface CryptoMetrics {
  x25519: number;
  mlkemGen: number;
  mlkemEncap: number;
  mlkemDecap: number;
  hkdf: number;
  aes: number;
  handshakeSuccess: number;
  hybridSession: number;
  packetsEncrypted: number;
  packetsDecrypted: number;
}

interface TimelineEvent {
  time: string;
  text: string;
  status: 'info' | 'warning' | 'success' | 'error';
}

export default function Experiment() {
  // --- Simulation Global States ---
  const [isPlaying, setIsPlaying] = useState(true); // Base traffic simulation
  const [metrics, setMetrics] = useState<MetricState>({
    clients: 1000,
    sessions: 842,
    messages: 42118,
    threats: 127,
    detections: 124,
    rotations: 19,
  });

  const [crypto, setCrypto] = useState<CryptoMetrics>({
    x25519: 1.02,
    mlkemGen: 15.61,
    mlkemEncap: 18.20,
    mlkemDecap: 16.89,
    hkdf: 0.41,
    aes: 0.09,
    handshakeSuccess: 99.8,
    hybridSession: 18.9,
    packetsEncrypted: 42118,
    packetsDecrypted: 42104,
  });

  // Crypto History for sparklines (each has 10 points)
  const [cryptoHistory, setCryptoHistory] = useState({
    x25519: [1.01, 1.03, 1.02, 1.00, 1.04, 1.02, 1.01, 1.03, 1.02, 1.02],
    mlkemGen: [15.5, 15.7, 15.6, 15.4, 15.8, 15.6, 15.5, 15.7, 15.61, 15.61],
    mlkemEncap: [18.0, 18.3, 18.1, 18.0, 18.4, 18.2, 18.1, 18.3, 18.2, 18.2],
    mlkemDecap: [16.7, 16.9, 16.8, 16.7, 17.0, 16.8, 16.7, 16.9, 16.89, 16.89],
    hybridSession: [18.7, 19.1, 18.9, 18.6, 19.2, 18.8, 18.7, 19.0, 18.9, 18.9],
  });

  // --- Attack Injection States ---
  const [attackOptions, setAttackOptions] = useState({
    bruteForce: true,
    credentialStuffing: false,
    ddosHandshake: false,
    sessionHijacking: false,
    expiredKey: false,
    insiderThreat: false,
  });

  const [intensity, setIntensity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Critical');
  const [attackers, setAttackers] = useState<number>(250);
  const [duration, setDuration] = useState<number>(30); // in seconds
  
  // --- Active Attack States ---
  const [attackActive, setAttackActive] = useState(false);
  const [attackTimeRemaining, setAttackTimeRemaining] = useState(0);
  const [attackProgress, setAttackProgress] = useState(0);
  const [attackSuccessProbability, setAttackSuccessProbability] = useState(0);
  const [targetComponent, setTargetComponent] = useState('Authentication Gateway');
  const [requestRate, setRequestRate] = useState(0);
  const [currentAttackName, setCurrentAttackName] = useState('');

  // --- AI Defense States ---
  const [aiDetectedThreat, setAiDetectedThreat] = useState<string>('None Detected');
  const [aiConfidence, setAiConfidence] = useState<number>(0);
  const [aiSeverity, setAiSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'NONE'>('NONE');
  const [aiTimeline, setAiTimeline] = useState<TimelineEvent[]>([]);
  const [aiActions, setAiActions] = useState({
    blockIP: { status: 'idle', label: 'Block Source IP' },
    rotateKeys: { status: 'idle', label: 'Rotate Session Keys' },
    revokeTokens: { status: 'idle', label: 'Revoke Session Tokens' },
    increaseMonitoring: { status: 'idle', label: 'Increase Monitoring' },
    alertOps: { status: 'idle', label: 'Alert Security Operations' },
  });

  // Ref for auto-scrolling log or timeline
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[SYSTEM] Cyber Range initialization completed.',
    '[SYSTEM] Listening on ports 443, 8443 (Hybrid KEM tunnels active).',
    '[TRAFFIC] Steady-state client communication online (X25519 + ML-KEM-768 hybrid mode).'
  ]);

  // Append a console log helper
  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  // --- Simulation Intervals ---
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // 1. Increment base messages and packets
      const newMsgs = Math.floor(Math.random() * 20) + 10;
      setMetrics(prev => ({
        ...prev,
        messages: prev.messages + newMsgs,
        sessions: Math.min(1000, Math.max(500, prev.sessions + Math.floor(Math.random() * 5) - 2)),
      }));

      setCrypto(prev => ({
        ...prev,
        packetsEncrypted: prev.packetsEncrypted + newMsgs,
        packetsDecrypted: prev.packetsDecrypted + newMsgs - (Math.random() > 0.95 ? 1 : 0),
        // Fluctuate latencies slightly
        x25519: parseFloat((1.02 + (Math.random() * 0.1 - 0.05)).toFixed(2)),
        mlkemGen: parseFloat((15.61 + (Math.random() * 0.8 - 0.4)).toFixed(2)),
        mlkemEncap: parseFloat((18.20 + (Math.random() * 1.0 - 0.5)).toFixed(2)),
        mlkemDecap: parseFloat((16.89 + (Math.random() * 0.8 - 0.4)).toFixed(2)),
        hkdf: parseFloat((0.41 + (Math.random() * 0.04 - 0.02)).toFixed(2)),
        aes: parseFloat((0.09 + (Math.random() * 0.02 - 0.01)).toFixed(2)),
        hybridSession: parseFloat((18.9 + (Math.random() * 1.2 - 0.6)).toFixed(2)),
      }));

      // Update sparkline histories
      setCryptoHistory(prev => ({
        x25519: [...prev.x25519.slice(1), parseFloat((1.02 + (Math.random() * 0.1 - 0.05)).toFixed(2))],
        mlkemGen: [...prev.mlkemGen.slice(1), parseFloat((15.61 + (Math.random() * 0.8 - 0.4)).toFixed(2))],
        mlkemEncap: [...prev.mlkemEncap.slice(1), parseFloat((18.20 + (Math.random() * 1.0 - 0.5)).toFixed(2))],
        mlkemDecap: [...prev.mlkemDecap.slice(1), parseFloat((16.89 + (Math.random() * 0.8 - 0.4)).toFixed(2))],
        hybridSession: [...prev.hybridSession.slice(1), parseFloat((18.9 + (Math.random() * 1.2 - 0.6)).toFixed(2))],
      }));

      // Random key rotation in normal operations
      if (Math.random() > 0.97) {
        setMetrics(prev => ({ ...prev, rotations: prev.rotations + 1 }));
        addLog('Automated periodic ML-KEM session key rotation executed.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Scroll console to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs, aiTimeline]);

  // --- Attack Active Countdown & Step Timeline Simulation ---
  useEffect(() => {
    if (!attackActive) return;

    let elapsed = 0;
    const totalDuration = duration;
    
    // Determine active attack name
    const activeList = Object.entries(attackOptions)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => {
        if (name === 'bruteForce') return 'Brute Force Login';
        if (name === 'credentialStuffing') return 'Credential Stuffing';
        if (name === 'ddosHandshake') return 'DDoS Handshake Flood';
        if (name === 'sessionHijacking') return 'Session Hijacking';
        if (name === 'expiredKey') return 'Expired Key Abuse';
        if (name === 'insiderThreat') return 'Insider Threat';
        return name;
      });
    const attackTitle = activeList.length > 0 ? activeList.join(' + ') : 'Generic Network Anomaly';

    // Start with low success rate, increases if defense doesn't complete
    setAttackSuccessProbability(95);

    const attackInterval = setInterval(() => {
      elapsed += 1;
      const remaining = totalDuration - elapsed;
      setAttackTimeRemaining(remaining);
      setAttackProgress(Math.floor((elapsed / totalDuration) * 100));

      // Increase requests/sec dynamically
      const baseReqs = intensity === 'Low' ? 1000 : intensity === 'Medium' ? 4000 : intensity === 'High' ? 8000 : 12500;
      setRequestRate(Math.floor(baseReqs + Math.random() * 1000 - 500));

      // Timeline events based on time elapsed
      const now = new Date();
      const formatTime = (d: Date) => d.toTimeString().split(' ')[0];

      if (elapsed === 1) {
        setAiDetectedThreat(attackTitle);
        setAiConfidence(0);
        setAiSeverity(intensity === 'Low' ? 'LOW' : intensity === 'Medium' ? 'MEDIUM' : intensity === 'High' ? 'HIGH' : 'CRITICAL');
        setAiTimeline([{
          time: formatTime(now),
          text: `Threat Detected: IP Anomaly originating from ${attackers} Attack Nodes`,
          status: 'warning'
        }]);
      } else if (elapsed === Math.floor(totalDuration * 0.15)) {
        setAiConfidence(84);
        setAiTimeline(prev => [...prev, {
          time: formatTime(now),
          text: `AI Analysis Started: Correlation engine checking signatures`,
          status: 'info'
        }]);
      } else if (elapsed === Math.floor(totalDuration * 0.3)) {
        setAiConfidence(96);
        setAiTimeline(prev => [...prev, {
          time: formatTime(now),
          text: `Threat Classified: Signature matched to ${attackTitle}`,
          status: 'warning'
        }]);
        // Trigger first defenses
        setAiActions(prev => ({
          ...prev,
          blockIP: { ...prev.blockIP, status: 'running' }
        }));
      } else if (elapsed === Math.floor(totalDuration * 0.45)) {
        setAiActions(prev => ({
          ...prev,
          blockIP: { ...prev.blockIP, status: 'completed' },
          rotateKeys: { ...prev.rotateKeys, status: 'running' },
          revokeTokens: { ...prev.revokeTokens, status: 'running' }
        }));
        setMetrics(prev => ({ ...prev, rotations: prev.rotations + 1 }));
        setAiTimeline(prev => [...prev, {
          time: formatTime(now),
          text: `Key Rotation Triggered & Source IPs Blocked`,
          status: 'success'
        }]);
        setAttackSuccessProbability(65);
      } else if (elapsed === Math.floor(totalDuration * 0.65)) {
        setAiActions(prev => ({
          ...prev,
          rotateKeys: { ...prev.rotateKeys, status: 'completed' },
          revokeTokens: { ...prev.revokeTokens, status: 'completed' },
          increaseMonitoring: { ...prev.increaseMonitoring, status: 'running' },
          alertOps: { ...prev.alertOps, status: 'running' }
        }));
        setAiTimeline(prev => [...prev, {
          time: formatTime(now),
          text: `Tokens Revoked. Enhanced monitoring active. Ops alerted.`,
          status: 'success'
        }]);
        setAttackSuccessProbability(25);
      } else if (elapsed === Math.floor(totalDuration * 0.85)) {
        setAiActions(prev => ({
          ...prev,
          increaseMonitoring: { ...prev.increaseMonitoring, status: 'completed' },
          alertOps: { ...prev.alertOps, status: 'completed' }
        }));
        setAiTimeline(prev => [...prev, {
          time: formatTime(now),
          text: `Threat Contained: Mitigation protocols fully implemented`,
          status: 'success'
        }]);
        setAttackSuccessProbability(2);
        // Decrease success rate of packets and slightly alert rate
        setCrypto(prev => ({ ...prev, handshakeSuccess: 99.8 }));
      }

      if (remaining <= 0) {
        clearInterval(attackInterval);
        setAttackActive(false);
        setAiDetectedThreat('None Detected');
        setAiConfidence(0);
        setAiSeverity('NONE');
        setAttackSuccessProbability(0);
        addLog(`Attack Campaign contained. All ${attackers} threat sources blacklisted.`);
      }
    }, 1000);

    return () => clearInterval(attackInterval);
  }, [attackActive]);

  // --- Handlers ---
  const handleLaunchAttack = () => {
    if (attackActive) return;

    // Check if at least one checkbox is checked
    const anyChecked = Object.values(attackOptions).some(v => v);
    if (!anyChecked) {
      alert('Please select at least one attack scenario to inject.');
      return;
    }

    setMetrics(prev => ({
      ...prev,
      threats: prev.threats + 1,
      detections: prev.detections + 1,
    }));

    // Reset AI Defense states
    setAiActions({
      blockIP: { status: 'idle', label: 'Block Source IP' },
      rotateKeys: { status: 'idle', label: 'Rotate Session Keys' },
      revokeTokens: { status: 'idle', label: 'Revoke Session Tokens' },
      increaseMonitoring: { status: 'idle', label: 'Increase Monitoring' },
      alertOps: { status: 'idle', label: 'Alert Security Operations' },
    });

    const activeList = Object.entries(attackOptions)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => {
        if (name === 'bruteForce') return 'Brute Force';
        if (name === 'credentialStuffing') return 'Credential Stuffing';
        if (name === 'ddosHandshake') return 'DDoS Handshake';
        if (name === 'sessionHijacking') return 'Session Hijacking';
        if (name === 'expiredKey') return 'Expired Key';
        if (name === 'insiderThreat') return 'Insider Threat';
        return name;
      });
    const attackTitle = activeList.join(' + ');
    setCurrentAttackName(attackTitle);

    // Dynamic targets
    if (attackOptions.ddosHandshake) setTargetComponent('Authentication Gateway');
    else if (attackOptions.expiredKey) setTargetComponent('Hybrid KEM Engine');
    else if (attackOptions.insiderThreat) setTargetComponent('Secure Database');
    else setTargetComponent('Gateway Layer');

    setCrypto(prev => ({ ...prev, handshakeSuccess: 88.4 })); // drop handshake success during flood

    addLog(`RESEARCH THREAT INJECTED: Launching ${attackTitle} with ${attackers} nodes.`);
    setAttackTimeRemaining(duration);
    setAttackProgress(0);
    setAttackActive(true);
  };

  const handleDownloadReport = () => {
    window.print();
  };

  // SVG sparkline generator
  const renderSparkline = (data: number[], colorClass: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 120;
    const height = 24;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height + 1;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={colorClass}
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-cyber-bg text-cyber-text-primary cyber-grid font-mono">
      <Navbar />

      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full print:p-0 print:m-0">
        
        {/* Main Title Section */}
        <div className="border-b border-cyber-border/80 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:border-none">
          <div>
            <div className="flex items-center gap-2 text-cyber-accent">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <h1 className="text-xl font-bold uppercase tracking-wider text-cyber-text-primary">
                Post-Quantum Cyber Range & Research Validation Lab
              </h1>
            </div>
            <p className="text-xs text-cyber-text-secondary mt-1">
              Enterprise-grade SOC cyber-range simulating X25519 + ML-KEM-768 hybrid resilience under injection stress.
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`border font-bold px-3 py-1.5 rounded text-[10px] uppercase transition duration-200 flex items-center gap-1.5 cursor-pointer ${
                isPlaying 
                  ? 'bg-cyber-accent-blue/10 border-cyber-accent-blue/40 text-cyber-accent-blue hover:bg-cyber-accent-blue/20' 
                  : 'bg-cyber-text-muted/10 border-cyber-text-muted/40 text-cyber-text-muted hover:bg-cyber-text-muted/20'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
              {isPlaying ? 'Telemetry Live' : 'Telemetry Paused'}
            </button>
            <button
              onClick={handleDownloadReport}
              className="bg-cyber-accent/15 border border-cyber-accent text-cyber-accent font-bold px-4 py-1.5 rounded text-[10px] uppercase hover:bg-cyber-accent hover:text-cyber-bg transition duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export Validation Report
            </button>
          </div>
        </div>

        {/* 1. RESEARCH TELEMETRY OVERVIEW */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyber-text-secondary flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full animate-ping"></span>
            RESEARCH TELEMETRY OVERVIEW
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { label: 'Virtual Clients', value: metrics.clients.toLocaleString(), status: 'healthy', border: 'border-cyber-border' },
              { label: 'Active Sessions', value: metrics.sessions.toLocaleString(), status: 'healthy', border: 'border-cyber-border' },
              { 
                label: 'Messages Processed', 
                value: metrics.messages.toLocaleString(), 
                status: 'pulse', 
                border: 'border-cyber-accent/30 text-cyber-accent glow-accent/5' 
              },
              { 
                label: 'Threats Injected', 
                value: metrics.threats.toString(), 
                status: attackActive ? 'critical' : 'warning', 
                border: attackActive ? 'border-cyber-accent-red/50 text-cyber-accent-red animate-pulse' : 'border-cyber-border' 
              },
              { 
                label: 'AI Detections', 
                value: metrics.detections.toString(), 
                status: 'warning', 
                border: 'border-cyber-border' 
              },
              { label: 'Key Rotations', value: metrics.rotations.toString(), status: 'info', border: 'border-cyber-border' },
            ].map((m, idx) => (
              <div 
                key={idx} 
                className={`bg-cyber-card border rounded-lg p-3 flex flex-col justify-between transition-all duration-300 ${m.border}`}
              >
                <span className="text-[10px] uppercase tracking-wider text-cyber-text-secondary font-semibold">
                  {m.label}
                </span>
                <span className="text-lg font-bold mt-1 tracking-tight">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. POST-QUANTUM CYBER RANGE TOPOLOGY */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyber-text-secondary flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyber-accent-blue rounded-full"></span>
            POST-QUANTUM CYBER RANGE TOPOLOGY
          </h2>
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden flex flex-col items-center">
            
            {/* Top-right status badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] border border-cyber-border bg-cyber-bg/80 px-2.5 py-1 rounded">
              <span className={`w-2 h-2 rounded-full ${attackActive ? 'bg-cyber-accent-red animate-ping' : 'bg-cyber-accent'}`} />
              <span className="font-bold uppercase tracking-wider">
                System Health: {attackActive ? 'INTRUSION DETECTED' : 'SECURE'}
              </span>
            </div>

            {/* Simulated Interactive SVG Diagram */}
            <div className="w-full max-w-4xl min-h-[340px] flex items-center justify-center relative">
              <svg viewBox="0 0 800 340" className="w-full h-full text-cyber-border">
                {/* Node coordinates & relationships map */}
                {/* Internet (400, 30) */}
                {/* Clients (250, 100), Attackers (550, 100) */}
                {/* Gateway Layer (400, 170) */}
                {/* Hybrid KEM Engine (400, 230) */}
                {/* AI Threat Analyzer (200, 230) - connected to Gateway/KEM */}
                {/* Secure Database (400, 300) */}
                
                {/* Path Lines with animated dash arrays */}
                {/* Internet to Clients / Attackers */}
                <path d="M 400 30 L 250 100" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-cyber-border" />
                <path d="M 400 30 L 550 100" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-cyber-border" />

                {/* Clients to Gateway */}
                <path 
                  d="M 250 100 L 400 170" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeDasharray="8,4" 
                  className={attackActive ? "text-cyber-accent/30" : "text-cyber-accent animate-[dash_10s_linear_infinite]"} 
                />

                {/* Attackers to Gateway */}
                {attackActive && (
                  <path 
                    d="M 550 100 L 400 170" 
                    stroke="#ff3b30" 
                    strokeWidth="3" 
                    strokeDasharray="6,3" 
                    className="animate-[dash_4s_linear_infinite]" 
                  />
                )}

                {/* Gateway to Hybrid KEM Engine */}
                <path 
                  d="M 400 170 L 400 230" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeDasharray="4,4" 
                  className={attackActive ? "text-cyber-accent-red animate-pulse" : "text-cyber-accent-blue"} 
                />

                {/* Gateway to AI Threat Analyzer */}
                <path 
                  d="M 400 170 L 250 230" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  className={attackActive ? "text-cyber-accent-red" : "text-cyber-text-muted"} 
                />

                {/* Hybrid KEM Engine to AI Threat Analyzer */}
                <path d="M 400 230 L 250 230" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />

                {/* Hybrid KEM Engine to Secure Database */}
                <path d="M 400 230 L 400 300" stroke="currentColor" strokeWidth="2.5" />

                {/* --- Pulsing Network Packets --- */}
                {!attackActive && isPlaying && (
                  <>
                    <circle r="4" fill="#00ff9d" className="animate-[pulse_1.5s_infinite]">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 250 100 L 400 170" />
                    </circle>
                    <circle r="3" fill="#00e5ff">
                      <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M 400 170 L 400 230" />
                    </circle>
                  </>
                )}

                {attackActive && (
                  <>
                    {/* Attack packets (Fast, red) */}
                    <circle r="5" fill="#ff3b30" className="animate-pulse">
                      <animateMotion dur="1s" repeatCount="indefinite" path="M 550 100 L 400 170" />
                    </circle>
                    <circle r="5" fill="#ff3b30" className="animate-pulse">
                      <animateMotion dur="1.2s" begin="0.3s" repeatCount="indefinite" path="M 550 100 L 400 170" />
                    </circle>
                    <circle r="4" fill="#ffcc00">
                      <animateMotion dur="1.5s" repeatCount="indefinite" path="M 400 170 L 250 230" />
                    </circle>
                  </>
                )}

                {/* --- Render Nodes --- */}
                {/* 1. Internet Node */}
                <g transform="translate(400, 30)">
                  <circle r="22" className="fill-cyber-bg stroke-cyber-border" strokeWidth="2" />
                  <Globe className="w-5 h-5 -translate-x-2.5 -translate-y-2.5 text-cyber-text-secondary" />
                  <text y="35" textAnchor="middle" fill="#94a3b8" className="text-[10px] font-bold">WAN / INTERNET</text>
                </g>

                {/* 2. Virtual Clients (1000) */}
                <g transform="translate(250, 100)">
                  <circle r="25" className="fill-cyber-bg stroke-cyber-accent" strokeWidth="2" />
                  <Users className="w-5 h-5 -translate-x-2.5 -translate-y-2.5 text-cyber-accent" />
                  <text y="38" textAnchor="middle" fill="#00ff9d" className="text-[10px] font-bold">VIRTUAL CLIENTS (1000)</text>
                  <text y="50" textAnchor="middle" fill="#94a3b8" className="text-[8px]">ACTIVE & SECURE</text>
                </g>

                {/* 3. Attack Nodes */}
                <g transform="translate(550, 100)">
                  <circle 
                    r="25" 
                    className={`fill-cyber-bg ${attackActive ? 'stroke-cyber-accent-red animate-pulse' : 'stroke-cyber-border'}`} 
                    strokeWidth="2" 
                  />
                  <Flame className={`w-5 h-5 -translate-x-2.5 -translate-y-2.5 ${attackActive ? 'text-cyber-accent-red' : 'text-cyber-text-muted'}`} />
                  <text y="38" textAnchor="middle" fill={attackActive ? "#ff3b30" : "#64748b"} className="text-[10px] font-bold">
                    ATTACK NODES ({attackActive ? attackers : '250'})
                  </text>
                  <text y="50" textAnchor="middle" fill="#94a3b8" className="text-[8px]">
                    {attackActive ? 'CAMPAIGN LAUNCHED' : 'DORMANT / INACTIVE'}
                  </text>
                </g>

                {/* 4. Gateway Layer */}
                <g transform="translate(400, 170)">
                  <rect x="-70" y="-18" width="140" height="36" rx="4" className={`fill-cyber-bg ${attackActive ? 'stroke-cyber-accent-red' : 'stroke-cyber-border'}`} strokeWidth="2" />
                  <Layers className={`w-4 h-4 -translate-y-2 -translate-x-12 ${attackActive ? 'text-cyber-accent-red' : 'text-cyber-accent-blue'}`} />
                  <text x="10" y="5" textAnchor="middle" fill="#f8fafc" className="text-[9px] font-bold uppercase tracking-wider">Gateway Layer</text>
                </g>

                {/* 5. Hybrid KEM Engine */}
                <g transform="translate(400, 230)">
                  <rect x="-100" y="-18" width="200" height="36" rx="4" className={`fill-cyber-bg ${attackActive ? 'stroke-cyber-accent-yellow' : 'stroke-cyber-accent'}`} strokeWidth="2" />
                  <Cpu className={`w-4 h-4 -translate-y-2 -translate-x-20 ${attackActive ? 'text-cyber-accent-yellow animate-spin' : 'text-cyber-accent'}`} />
                  <text x="10" y="5" textAnchor="middle" fill="#f8fafc" className="text-[9px] font-bold uppercase tracking-wider">Hybrid KEM (X25519 + ML-KEM)</text>
                </g>

                {/* 6. AI Threat Analyzer */}
                <g transform="translate(200, 230)">
                  <circle r="22" className={`fill-cyber-bg ${attackActive ? 'stroke-cyber-accent-red animate-ping' : 'stroke-cyber-border'}`} strokeWidth="1.5" />
                  <circle r="22" className={`fill-cyber-bg ${attackActive ? 'stroke-cyber-accent-red' : 'stroke-cyber-border'}`} strokeWidth="2" />
                  <ShieldCheck className={`w-5 h-5 -translate-x-2.5 -translate-y-2.5 ${attackActive ? 'text-cyber-accent-red' : 'text-cyber-accent-blue'}`} />
                  <text y="35" textAnchor="middle" fill="#94a3b8" className="text-[8px] font-bold">AI THREAT ANALYZER</text>
                </g>

                {/* 7. Secure Database */}
                <g transform="translate(400, 300)">
                  <circle r="22" className="fill-cyber-bg stroke-cyber-border" strokeWidth="2" />
                  <Database className="w-5 h-5 -translate-x-2.5 -translate-y-2.5 text-cyber-text-secondary" />
                  <text y="35" textAnchor="middle" fill="#94a3b8" className="text-[9px] font-bold">SECURE DATABASE</text>
                </g>
              </svg>
            </div>
          </div>
        </section>

        {/* 3. TWO COLUMN: ATTACK INJECTION & AI DEFENSE ORCHESTRATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Attack Injection Console */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyber-text-secondary flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyber-accent-red rounded-full"></span>
              ATTACK INJECTION CONSOLE
            </h2>
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 flex flex-col justify-between h-[400px]">
              
              {/* Option checkboxes */}
              <div className="space-y-2.5">
                <span className="text-[9px] uppercase tracking-wider text-cyber-text-secondary font-bold block">
                  Select Target Vulnerability Scenario
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'bruteForce', label: 'Brute Force Login Attack' },
                    { key: 'credentialStuffing', label: 'Credential Stuffing Campaign' },
                    { key: 'ddosHandshake', label: 'DDoS Handshake Flood' },
                    { key: 'sessionHijacking', label: 'Session Hijacking' },
                    { key: 'expiredKey', label: 'Expired Key Abuse' },
                    { key: 'insiderThreat', label: 'Insider Threat Activity' },
                  ].map((item) => (
                    <label 
                      key={item.key} 
                      className={`flex items-center gap-2 p-2 rounded border transition cursor-pointer select-none ${
                        attackOptions[item.key as keyof typeof attackOptions]
                          ? 'bg-cyber-accent-red/5 border-cyber-accent-red/35 text-cyber-accent-red'
                          : 'bg-black/20 border-cyber-border hover:border-cyber-text-secondary text-cyber-text-secondary'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={attackOptions[item.key as keyof typeof attackOptions]}
                        disabled={attackActive}
                        onChange={() => setAttackOptions(prev => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof attackOptions]
                        }))}
                        className="hidden"
                      />
                      <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center text-[9px] ${
                        attackOptions[item.key as keyof typeof attackOptions] ? 'border-cyber-accent-red bg-cyber-accent-red text-cyber-bg' : 'border-cyber-border'
                      }`}>
                        {attackOptions[item.key as keyof typeof attackOptions] && '✓'}
                      </span>
                      <span className="text-[10px] font-semibold">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sliders & Parameters */}
              <div className="grid grid-cols-3 gap-3 my-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-cyber-text-secondary font-bold block mb-1">
                    Intensity
                  </span>
                  <div className="flex gap-1">
                    {(['Low', 'Medium', 'High', 'Critical'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        disabled={attackActive}
                        onClick={() => setIntensity(lvl)}
                        className={`flex-1 text-[8px] font-bold py-1.5 border rounded uppercase ${
                          intensity === lvl 
                            ? 'bg-cyber-accent-red/20 border-cyber-accent-red text-cyber-accent-red' 
                            : 'bg-black/10 border-cyber-border text-cyber-text-secondary hover:border-cyber-text-secondary'
                        }`}
                      >
                        {lvl.slice(0, 4)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-wider text-cyber-text-secondary font-bold block mb-1">
                    Attackers: {attackers}
                  </span>
                  <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    step="50"
                    disabled={attackActive}
                    value={attackers} 
                    onChange={(e) => setAttackers(parseInt(e.target.value))}
                    className="w-full accent-cyber-accent-red cursor-pointer"
                  />
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-wider text-cyber-text-secondary font-bold block mb-1">
                    Duration: {duration}s
                  </span>
                  <input 
                    type="range" 
                    min="10" 
                    max="120" 
                    step="10"
                    disabled={attackActive}
                    value={duration} 
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full accent-cyber-accent-red cursor-pointer"
                  />
                </div>
              </div>

              {/* Status / Launch Action */}
              <div className="border-t border-cyber-border/80 pt-3">
                {attackActive ? (
                  <div className="bg-cyber-accent-red/5 border border-cyber-accent-red/30 rounded p-3 text-xs space-y-2 animate-pulse">
                    <div className="flex justify-between items-center text-cyber-accent-red font-bold uppercase text-[10px]">
                      <span>⚡ Campaign Active</span>
                      <span>Target: {targetComponent}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-cyber-text-secondary font-semibold">
                      <div>Nodes: <span className="text-cyber-accent-red">{attackers}</span></div>
                      <div>Reqs/sec: <span className="text-cyber-accent-red">{requestRate}</span></div>
                      <div>Prob: <span className="text-cyber-accent-red">{attackSuccessProbability}%</span></div>
                    </div>
                    <div className="w-full bg-cyber-bg border border-cyber-border h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-cyber-accent-red h-full transition-all duration-300"
                        style={{ width: `${attackProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-cyber-text-muted uppercase">
                      <span>Progress: {attackProgress}%</span>
                      <span>Remaining: {attackTimeRemaining}s</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleLaunchAttack}
                    className="w-full bg-cyber-accent-red/15 border border-cyber-accent-red text-cyber-accent-red font-bold py-2.5 rounded text-xs uppercase hover:bg-cyber-accent-red hover:text-cyber-bg transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4" />
                    Launch Stress Campaign
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* AI Defense Orchestration Engine */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyber-text-secondary flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyber-accent-blue rounded-full"></span>
              AI DEFENSE ORCHESTRATION ENGINE
            </h2>
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 flex flex-col justify-between h-[400px]">
              
              {/* Detection Metadata */}
              <div className="grid grid-cols-3 gap-3 border-b border-cyber-border/80 pb-3">
                <div className="bg-black/30 border border-cyber-border p-2.5 rounded">
                  <span className="text-[8px] uppercase tracking-wider text-cyber-text-secondary font-bold block">
                    Detected Threat
                  </span>
                  <span className={`text-[10px] font-bold block mt-0.5 truncate ${attackActive ? 'text-cyber-accent-red animate-pulse' : 'text-cyber-text-muted'}`}>
                    {aiDetectedThreat}
                  </span>
                </div>
                <div className="bg-black/30 border border-cyber-border p-2.5 rounded">
                  <span className="text-[8px] uppercase tracking-wider text-cyber-text-secondary font-bold block">
                    AI Confidence
                  </span>
                  <span className="text-[10px] font-bold block mt-0.5 text-cyber-accent-blue">
                    {attackActive ? `${aiConfidence}%` : '0%'}
                  </span>
                </div>
                <div className="bg-black/30 border border-cyber-border p-2.5 rounded">
                  <span className="text-[8px] uppercase tracking-wider text-cyber-text-secondary font-bold block">
                    Severity
                  </span>
                  <span className={`text-[10px] font-bold block mt-0.5 ${
                    aiSeverity === 'CRITICAL' || aiSeverity === 'HIGH' ? 'text-cyber-accent-red' : aiSeverity === 'MEDIUM' ? 'text-cyber-accent-yellow' : 'text-cyber-text-muted'
                  }`}>
                    {aiSeverity}
                  </span>
                </div>
              </div>

              {/* Checklist and Timeline Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 overflow-hidden flex-1">
                
                {/* Checklist of actions */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-cyber-text-secondary font-bold block">
                    Automated Actions
                  </span>
                  <div className="space-y-1.5 text-[10px]">
                    {Object.values(aiActions).map((act, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-2 p-1.5 border rounded ${
                          act.status === 'completed' 
                            ? 'bg-cyber-accent/5 border-cyber-accent/30 text-cyber-accent' 
                            : act.status === 'running' 
                            ? 'bg-cyber-accent-blue/5 border-cyber-accent-blue/30 text-cyber-accent-blue animate-pulse' 
                            : 'bg-black/10 border-cyber-border/50 text-cyber-text-muted'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 flex items-center justify-center">
                          {act.status === 'completed' ? (
                            <Check className="w-3 h-3 text-cyber-accent" />
                          ) : act.status === 'running' ? (
                            <RefreshCw className="w-3 h-3 text-cyber-accent-blue animate-spin" />
                          ) : (
                            <span className="w-1.5 h-1.5 bg-cyber-text-muted rounded-full" />
                          )}
                        </span>
                        <span className="font-bold">{act.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex flex-col h-full">
                  <span className="text-[9px] uppercase tracking-wider text-cyber-text-secondary font-bold block mb-1">
                    Timeline
                  </span>
                  <div className="flex-1 bg-black/40 border border-cyber-border rounded p-2 overflow-y-auto text-[9px] font-mono space-y-1.5">
                    {aiTimeline.length === 0 ? (
                      <div className="text-cyber-text-muted italic flex items-center gap-1">
                        <span>Waiting for threat metrics...</span>
                      </div>
                    ) : (
                      aiTimeline.map((evt, idx) => (
                        <div key={idx} className="leading-snug">
                          <span className="text-cyber-accent-blue mr-1">[{evt.time}]</span>
                          <span className={
                            evt.status === 'warning' ? 'text-cyber-accent-red' : evt.status === 'success' ? 'text-cyber-accent' : 'text-cyber-text-secondary'
                          }>
                            {evt.text}
                          </span>
                        </div>
                      ))
                    )}
                    <div ref={consoleEndRef} />
                  </div>
                </div>

              </div>

              {/* Progress Indicator */}
              <div className="border-t border-cyber-border/80 pt-3 flex justify-between items-center text-[10px] text-cyber-text-secondary">
                <span>Mitigation Protocol Status:</span>
                <span className={attackActive ? 'text-cyber-accent-blue animate-pulse font-bold' : 'text-cyber-text-muted font-semibold'}>
                  {attackActive ? 'Mitigating Threat...' : 'Standby / Idle'}
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* 4. POST-QUANTUM CRYPTOGRAPHIC TELEMETRY */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyber-text-secondary flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full"></span>
            POST-QUANTUM CRYPTOGRAPHIC TELEMETRY
          </h2>
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Classical & PQ Benchmarks */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-cyber-accent font-bold block border-b border-cyber-border/50 pb-1.5">
                Latency Benchmarks
              </span>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: 'X25519 Key Generation', value: `${crypto.x25519} ms`, history: cryptoHistory.x25519, color: 'text-cyber-accent', thresh: 'green' },
                  { label: 'ML-KEM-768 Key Generation', value: `${crypto.mlkemGen} ms`, history: cryptoHistory.mlkemGen, color: 'text-cyber-accent-yellow', thresh: 'yellow' },
                  { label: 'ML-KEM Encapsulation', value: `${crypto.mlkemEncap} ms`, history: cryptoHistory.mlkemEncap, color: 'text-cyber-accent-yellow', thresh: 'yellow' },
                  { label: 'ML-KEM Decapsulation', value: `${crypto.mlkemDecap} ms`, history: cryptoHistory.mlkemDecap, color: 'text-cyber-accent-yellow', thresh: 'yellow' },
                  { label: 'HKDF Derivation', value: `${crypto.hkdf} ms`, color: 'text-cyber-accent', thresh: 'green' },
                  { label: 'AES-256-GCM Encryption', value: `${crypto.aes} ms`, color: 'text-cyber-accent', thresh: 'green' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-cyber-text-secondary font-semibold block">{item.label}</span>
                      <span className="font-bold text-cyber-text-primary mt-0.5 block">{item.value}</span>
                    </div>
                    {item.history && (
                      <div className="opacity-80">
                        {renderSparkline(item.history, item.color)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Key Handshake Rates */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-cyber-accent-blue font-bold block border-b border-cyber-border/50 pb-1.5">
                Key Negotiation Rates
              </span>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cyber-text-secondary font-semibold">Handshake Success Rate</span>
                    <span className={`font-bold ${crypto.handshakeSuccess >= 99 ? 'text-cyber-accent' : 'text-cyber-accent-red'}`}>
                      {crypto.handshakeSuccess}%
                    </span>
                  </div>
                  <div className="w-full bg-cyber-bg border border-cyber-border h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${crypto.handshakeSuccess >= 99 ? 'bg-cyber-accent' : 'bg-cyber-accent-red'}`}
                      style={{ width: `${crypto.handshakeSuccess}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cyber-text-secondary font-semibold">Hybrid Session Establishment</span>
                    <span className="text-cyber-accent-blue font-bold">
                      {crypto.hybridSession} ms
                    </span>
                  </div>
                  {renderSparkline(cryptoHistory.hybridSession, 'text-cyber-accent-blue')}
                </div>
              </div>
            </div>

            {/* Column 3: Traffic Packet Counts */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-cyber-text-secondary font-bold block border-b border-cyber-border/50 pb-1.5">
                Packet Encapsulations
              </span>
              <div className="space-y-4">
                <div className="bg-black/20 border border-cyber-border p-3 rounded flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-cyber-text-secondary font-semibold">
                      Packets Encrypted
                    </span>
                    <span className="text-sm font-bold text-cyber-text-primary mt-1 block">
                      {crypto.packetsEncrypted.toLocaleString()}
                    </span>
                  </div>
                  <Zap className="w-5 h-5 text-cyber-accent animate-pulse" />
                </div>

                <div className="bg-black/20 border border-cyber-border p-3 rounded flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-cyber-text-secondary font-semibold">
                      Packets Decrypted
                    </span>
                    <span className="text-sm font-bold text-cyber-text-primary mt-1 block">
                      {crypto.packetsDecrypted.toLocaleString()}
                    </span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-cyber-accent-blue" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Real-time System Console Log Streams */}
        <section className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-cyber-text-secondary flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyber-text-muted" />
            CONSOLE STREAMS
          </h2>
          <div className="bg-black/80 border border-cyber-border rounded-xl p-4 text-[10px] text-cyber-accent font-mono h-[120px] overflow-y-auto space-y-1 glow-accent-blue print:border-none print:bg-white print:text-black">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
