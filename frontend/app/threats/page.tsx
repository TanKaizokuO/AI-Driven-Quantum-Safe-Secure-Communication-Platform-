'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ThreatFeed, { ThreatItem } from '@/components/ThreatFeed';
import { apiFetch } from '@/lib/api';
import { AlertCircle, AlertTriangle, ShieldAlert, Heart } from 'lucide-react';

export default function Threats() {
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreats();

    // Poll every 5s for new threat assessments
    const interval = setInterval(fetchThreats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchThreats = async () => {
    try {
      const feed = await apiFetch('/threats/feed');
      setThreats(feed);
    } catch (e) {
      console.error('Failed to fetch threats:', e);
    } finally {
      setLoading(false);
    }
  };

  // Compute stats
  const criticalCount = threats.filter(t => t.severity === 'CRITICAL').length;
  const highCount = threats.filter(t => t.severity === 'HIGH').length;
  const mediumCount = threats.filter(t => t.severity === 'MEDIUM').length;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 p-6 space-y-6 max-w-5xl mx-auto w-full">
        {/* Header Title */}
        <div className="border-b border-cyber-border/80 pb-4">
          <h1 className="text-xl font-bold uppercase tracking-wider text-cyber-text-primary flex items-center gap-2">
            <ShieldAlert className="text-cyber-accent" />
            AI Cybersecurity Shield Diagnostics
          </h1>
          <p className="text-xs text-cyber-text-secondary mt-1 font-mono">
            Continuous anomaly logging streams processed by local Ollama AI model (llama3 / mistral).
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 font-mono text-cyber-accent text-xs">
            [SYS] DIAL-UP TO SECURE THREAT MATRIX...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono">
            {/* Quick summary stats */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-cyber-card border border-cyber-border rounded-xl p-4">
                <span className="text-[10px] text-cyber-text-secondary uppercase font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  Critical Threats
                </span>
                <p id="critical-threats-count" className="text-xl font-bold text-red-500 mt-1">{criticalCount}</p>
              </div>

              <div className="bg-cyber-card border border-cyber-border rounded-xl p-4">
                <span className="text-[10px] text-cyber-text-secondary uppercase font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                  High Threats
                </span>
                <p className="text-xl font-bold text-orange-400 mt-1">{highCount}</p>
              </div>

              <div className="bg-cyber-card border border-cyber-border rounded-xl p-4">
                <span className="text-[10px] text-cyber-text-secondary uppercase font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                  Medium Risks
                </span>
                <p className="text-xl font-bold text-yellow-400 mt-1">{mediumCount}</p>
              </div>

              <div className="bg-cyber-card border border-cyber-border rounded-xl p-4">
                <span className="text-[10px] text-cyber-text-secondary uppercase font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-emerald-400" />
                  Health Status
                </span>
                <p className="text-sm font-bold text-emerald-400 mt-1">SHIELD ENGAGED</p>
              </div>
            </div>

            {/* Live Feed List */}
            <div className="md:col-span-3">
              <ThreatFeed threats={threats} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
