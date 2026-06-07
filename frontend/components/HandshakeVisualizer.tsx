'use client';

import React, { useEffect, useState } from 'react';

export default function HandshakeVisualizer() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    // Loop through 4 phases of visualization
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-cyber-card border border-cyber-border rounded-xl p-6 glow-accent relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-cyber-accent text-sm font-bold tracking-wider uppercase font-mono">
          Hybrid Handshake Flow Visualizer
        </h3>
        <div className="text-xs font-mono text-cyber-text-secondary flex gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Classical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Post-Quantum
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Hybrid Secret
          </span>
        </div>
      </div>

      <div className="w-full flex justify-center py-4 bg-cyber-bg/40 rounded-lg border border-cyber-border/40">
        <svg viewBox="0 0 600 160" className="w-full max-w-xl">
          {/* Definitions for animations and gradients */}
          <defs>
            <linearGradient id="classicalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="pqGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="hybridGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#00ff9d" />
            </linearGradient>
          </defs>

          {/* Connectors / Paths */}
          {/* Path 1: Client A to Server (Classical / X25519) */}
          <path
            d="M 100 80 Q 200 40 300 80"
            fill="none"
            stroke={activeStage === 0 ? 'url(#classicalGrad)' : '#1e2d5a'}
            strokeWidth="3"
            strokeDasharray={activeStage === 0 ? '8,8' : 'none'}
            className={activeStage === 0 ? 'animate-[dash_2s_linear_infinite]' : ''}
          />

          {/* Path 2: Server to Client B (Post-Quantum / ML-KEM) */}
          <path
            d="M 300 80 Q 400 40 500 80"
            fill="none"
            stroke={activeStage === 1 ? 'url(#pqGrad)' : '#1e2d5a'}
            strokeWidth="3"
            strokeDasharray={activeStage === 1 ? '8,8' : 'none'}
            className={activeStage === 1 ? 'animate-[dash_2s_linear_infinite]' : ''}
          />

          {/* Path 3: Client B to Server (Encapsulation return) */}
          <path
            d="M 500 80 Q 400 120 300 80"
            fill="none"
            stroke={activeStage === 2 ? 'url(#pqGrad)' : '#1e2d5a'}
            strokeWidth="3"
            strokeDasharray={activeStage === 2 ? '8,8' : 'none'}
            className={activeStage === 2 ? 'animate-[dash_2s_linear_infinite]' : ''}
          />

          {/* Path 4: Server to Client A (Hybrid Complete Shared Secret derived) */}
          <path
            d="M 300 80 Q 200 120 100 80"
            fill="none"
            stroke={activeStage === 3 ? 'url(#hybridGrad)' : '#1e2d5a'}
            strokeWidth="4"
            strokeDasharray={activeStage === 3 ? '8,8' : 'none'}
            className={activeStage === 3 ? 'animate-[dash_2s_linear_infinite]' : ''}
          />

          {/* Nodes */}
          {/* Node 1: Client A */}
          <g transform="translate(100, 80)">
            <circle r="30" fill="#111a33" stroke="#1e2d5a" strokeWidth="2" />
            <circle r="24" fill="#0c1328" />
            <text textAnchor="middle" dy="5" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">CLIENT A</text>
          </g>

          {/* Node 2: Server */}
          <g transform="translate(300, 80)">
            <circle r="34" fill="#111a33" stroke="#1e2d5a" strokeWidth="2" />
            <circle r="28" fill="#0c1328" />
            <text textAnchor="middle" dy="5" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">SERVER</text>
          </g>

          {/* Node 3: Client B */}
          <g transform="translate(500, 80)">
            <circle r="30" fill="#111a33" stroke="#1e2d5a" strokeWidth="2" />
            <circle r="24" fill="#0c1328" />
            <text textAnchor="middle" dy="5" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">CLIENT B</text>
          </g>
        </svg>
      </div>

      <div className="mt-4 bg-cyber-bg/80 border border-cyber-border rounded p-4 text-xs font-mono text-center">
        {activeStage === 0 && (
          <p className="text-amber-500">
            [Stage 1/4] Client A sends classical X25519 Ephemeral Public Key to Server (low latency key exchange).
          </p>
        )}
        {activeStage === 1 && (
          <p className="text-cyan-400">
            [Stage 2/4] Server responds and starts Post-Quantum ML-KEM-768 encapsulation request with Client B.
          </p>
        )}
        {activeStage === 2 && (
          <p className="text-cyan-400">
            [Stage 3/4] Client B encapsulates the session key with Server's public key and transmits it back.
          </p>
        )}
        {activeStage === 3 && (
          <p className="text-emerald-400">
            [Stage 4/4] Both sides combine secrets using HKDF-SHA256. Dual security channel established successfully!
          </p>
        )}
      </div>
      
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}</style>
    </div>
  );
}
