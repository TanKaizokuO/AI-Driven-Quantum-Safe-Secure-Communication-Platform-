'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { apiFetch } from '@/lib/api';
import { Shield, Users, RefreshCw, AlertTriangle, Key, Cpu, Zap, Activity } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeSessions: 1247,
    keyRotations: 43,
    threatScore: 0.12,
    threatSeverity: 'LOW',
    avgHandshakeTime: '54.4ms',
    keysGenerated: 2494,
    ollamaStatus: 'Active (llama3)',
    lastAnalysis: '2s ago',
    anomaliesDetected: 3,
    nextRotation: 'key_7f3a (in ~4 min)'
  });

  const [sessionUserB, setSessionUserB] = useState('');
  const [networkProfile, setNetworkProfile] = useState('normal');
  const [connectSessionId, setConnectSessionId] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    // Auth guard
    if (!localStorage.getItem('token')) {
      router.push('/');
      return;
    }
    setLoading(false);

    // Poll to update stats slightly and simulate life
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeSessions: prev.activeSessions + (Math.random() > 0.5 ? 1 : -1),
        keysGenerated: prev.keysGenerated + Math.floor(Math.random() * 2),
        threatScore: Math.max(0.05, Math.min(0.95, Number((prev.threatScore + (Math.random() * 0.04 - 0.02)).toFixed(2)))),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    const username = localStorage.getItem('username') || 'operator';
    
    if (!sessionUserB.trim()) {
      setActionError('Recipient username is required.');
      return;
    }

    try {
      const result = await apiFetch('/session/create', {
        method: 'POST',
        body: JSON.stringify({
          user_a: username,
          user_b: sessionUserB,
          network_profile: networkProfile
        }),
      });

      // Redirect directly to the chat page with session_id
      router.push(`/chat?session_id=${result.session_id}`);
    } catch (err: any) {
      setActionError(err.message || 'Failed to create quantum channel.');
    }
  };

  const handleConnectSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    const username = localStorage.getItem('username') || 'operator';

    if (!connectSessionId.trim()) {
      setActionError('Session ID is required.');
      return;
    }

    try {
      const result = await apiFetch('/session/connect', {
        method: 'POST',
        body: JSON.stringify({
          session_id: connectSessionId,
          username: username
        }),
      });

      router.push(`/chat?session_id=${result.session_id}`);
    } catch (err: any) {
      setActionError(err.message || 'Failed to connect to session.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen font-mono text-cyber-accent text-xs">
        [SYS] SECURING CLIENT HANDSHAKE...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-cyber-border/80 pb-4">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-cyber-text-primary flex items-center gap-2">
              <Shield className="text-cyber-accent" />
              Quantum Communication Platform Overview
            </h1>
            <p className="text-xs text-cyber-text-secondary mt-1">
              Real-time hardware simulation and Post-Quantum cryptographic tunnel controls.
            </p>
          </div>
          <span className="text-[10px] text-cyber-accent border border-cyber-accent/30 bg-cyber-accent/5 px-2.5 py-1 rounded font-mono uppercase animate-pulse">
            System Hybrid State: STABLE
          </span>
        </div>

        {/* Action Error if any */}
        {actionError && (
          <div className="p-3 bg-red-950/20 border border-red-500/30 rounded text-red-400 text-xs font-mono">
            [SYS ACTION ERROR] {actionError}
          </div>
        )}

        {/* System Status Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
          <div className="bg-cyber-card border border-cyber-border rounded-lg p-4 flex flex-col justify-between">
            <span className="text-[10px] text-cyber-text-secondary uppercase font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyber-accent-blue" />
              Active Sessions
            </span>
            <span id="active-sessions-count" className="text-2xl font-bold text-cyber-accent-blue mt-2">
              {stats.activeSessions.toLocaleString()}
            </span>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-lg p-4 flex flex-col justify-between">
            <span className="text-[10px] text-cyber-text-secondary uppercase font-bold flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-cyber-accent" />
              Key Rotations
            </span>
            <span id="key-rotations-count" className="text-2xl font-bold text-cyber-accent mt-2">
              {stats.keyRotations}
            </span>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-lg p-4 flex flex-col justify-between">
            <span className="text-[10px] text-cyber-text-secondary uppercase font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-cyber-accent-yellow" />
              Threat Score
            </span>
            <span id="threat-score-val" className="text-2xl font-bold text-cyber-accent-yellow mt-2">
              {stats.threatScore} <span className="text-xs text-cyber-text-secondary">({stats.threatSeverity})</span>
            </span>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-lg p-4 flex flex-col justify-between">
            <span className="text-[10px] text-cyber-text-secondary uppercase font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyber-accent" />
              Primary Core Mode
            </span>
            <span className="text-2xl font-bold text-cyber-accent mt-2">
              HYBRID
            </span>
          </div>
        </div>

        {/* Cryptography Status & AI Subsystem Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cryptography details */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 glow-accent-blue font-mono">
            <h3 className="text-cyber-accent-blue text-xs font-bold uppercase border-b border-cyber-border/80 pb-2.5 mb-4 tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4" />
              Cryptography Status Core
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center bg-cyber-bg/40 p-2.5 rounded border border-cyber-border/30">
                <span className="text-cyber-text-secondary">ML-KEM-768 Core:</span>
                <span className="text-cyber-accent font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full animate-ping" />
                  ACTIVE
                </span>
              </div>
              <div className="flex justify-between items-center bg-cyber-bg/40 p-2.5 rounded border border-cyber-border/30">
                <span className="text-cyber-text-secondary">X25519 Elliptic Curve:</span>
                <span className="text-cyber-accent font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full animate-ping" />
                  ACTIVE
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyber-text-secondary">Avg Handshake Latency:</span>
                <span className="text-cyber-text-primary font-bold">{stats.avgHandshakeTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyber-text-secondary">Simulated Keys Derived:</span>
                <span className="text-cyber-text-primary font-bold">{stats.keysGenerated}</span>
              </div>
            </div>
          </div>

          {/* AI Subsystem details */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 glow-accent font-mono">
            <h3 className="text-cyber-accent text-xs font-bold uppercase border-b border-cyber-border/80 pb-2.5 mb-4 tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              AI Security Guard Subsystem
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center bg-cyber-bg/40 p-2.5 rounded border border-cyber-border/30">
                <span className="text-cyber-text-secondary">Ollama AI Connection:</span>
                <span className="text-cyber-accent-blue font-semibold">{stats.ollamaStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyber-text-secondary">Last Threat Analysis:</span>
                <span className="text-cyber-text-primary font-bold">{stats.lastAnalysis}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyber-text-secondary">Anomalies Detected:</span>
                <span className="text-cyber-accent-red font-bold">{stats.anomaliesDetected}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyber-text-secondary">Next AI Rotation Schedule:</span>
                <span className="text-cyber-accent-yellow font-semibold">{stats.nextRotation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Access Tunnels (Create / Connect Sessions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Session */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 font-mono">
            <h3 className="text-cyber-accent-blue text-xs font-bold uppercase mb-4 tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyber-accent-blue" />
              Initiate Secure Quantum Channel
            </h3>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-[10px] text-cyber-text-secondary uppercase mb-1.5 font-bold">
                  Recipient Username
                </label>
                <input
                  id="create-session-user-b"
                  type="text"
                  required
                  placeholder="e.g. alice, bob"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-xs text-cyber-text-primary focus:outline-none focus:border-cyber-accent-blue"
                  value={sessionUserB}
                  onChange={(e) => setSessionUserB(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] text-cyber-text-secondary uppercase mb-1.5 font-bold">
                  Simulated Network Profile
                </label>
                <select
                  id="create-session-profile"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-xs text-cyber-text-primary focus:outline-none focus:border-cyber-accent-blue"
                  value={networkProfile}
                  onChange={(e) => setNetworkProfile(e.target.value)}
                >
                  <option value="normal">Normal (10ms latency, 0% packet loss)</option>
                  <option value="wan">WAN (100ms latency, 1% packet loss)</option>
                  <option value="mobile">Mobile (250ms latency, 3% packet loss)</option>
                  <option value="adverse">Adverse (500ms latency, 5% packet loss)</option>
                </select>
              </div>

              <button
                id="create-channel-btn"
                type="submit"
                className="w-full bg-cyber-accent-blue/15 border border-cyber-accent-blue text-cyber-accent-blue py-2 rounded text-xs font-bold uppercase hover:bg-cyber-accent-blue hover:text-cyber-bg transition duration-200 cursor-pointer"
              >
                Create Hybrid Channel
              </button>
            </form>
          </div>

          {/* Connect Session */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 font-mono">
            <h3 className="text-cyber-accent text-xs font-bold uppercase mb-4 tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyber-accent" />
              Join Existing Channel
            </h3>
            <form onSubmit={handleConnectSession} className="space-y-4">
              <div>
                <label className="block text-[10px] text-cyber-text-secondary uppercase mb-1.5 font-bold">
                  Target Session ID
                </label>
                <input
                  id="connect-session-id"
                  type="text"
                  required
                  placeholder="Enter 32-character session hex"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-xs text-cyber-text-primary focus:outline-none focus:border-cyber-accent-blue font-mono"
                  value={connectSessionId}
                  onChange={(e) => setConnectSessionId(e.target.value)}
                />
              </div>

              <div className="h-14" /> {/* Spacer to align button */}

              <button
                id="connect-channel-btn"
                type="submit"
                className="w-full bg-cyber-accent/15 border border-cyber-accent text-cyber-accent py-2 rounded text-xs font-bold uppercase hover:bg-cyber-accent hover:text-cyber-bg transition duration-200 cursor-pointer"
              >
                Join Channel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
