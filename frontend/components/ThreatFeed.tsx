'use client';

import React from 'react';

export interface ThreatItem {
  id: number;
  session_id: string;
  threat_score: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  action: 'MONITOR' | 'ROTATE_KEY' | 'TERMINATE_SESSION';
  reasoning: string;
  timestamp: string;
}

interface ThreatFeedProps {
  threats: ThreatItem[];
}

export default function ThreatFeed({ threats }: ThreatFeedProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-500/50 bg-red-950/20 text-red-400';
      case 'HIGH': return 'border-orange-500/50 bg-orange-950/20 text-orange-400';
      case 'MEDIUM': return 'border-yellow-500/50 bg-yellow-950/20 text-yellow-400';
      default: return 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400';
    }
  };

  const getProgressColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="w-full bg-cyber-card border border-cyber-border rounded-xl p-6 glow-accent max-h-[400px] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-cyber-border pb-4 mb-4">
        <h3 className="text-cyber-accent text-sm font-bold tracking-wider uppercase font-mono flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-cyber-accent rounded-full animate-pulse" />
          AI Threat Assessment & Anomaly Feed
        </h3>
        <span className="text-[10px] text-cyber-text-muted font-mono uppercase">
          Continuous Monitoring Active
        </span>
      </div>

      <div className="space-y-3 font-mono">
        {threats.length === 0 ? (
          <div className="text-center py-8 text-cyber-text-muted text-xs">
            [SYS STATUS] No threats detected. System is running securely.
          </div>
        ) : (
          threats.map((threat) => (
            <div
              key={threat.id}
              className={`p-3 rounded border text-xs transition-all duration-300 ${getSeverityColor(threat.severity)}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold tracking-wide">
                  [{threat.severity}] - Session: {threat.session_id ? threat.session_id.substring(0, 8) : 'Global'}
                </span>
                <span className="text-[10px] text-cyber-text-muted">
                  {new Date(threat.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span>Threat Level Index</span>
                  <span>{Math.round(threat.threat_score * 100)}%</span>
                </div>
                <div className="w-full bg-cyber-bg h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(threat.severity)}`}
                    style={{ width: `${threat.threat_score * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] leading-relaxed mb-2 opacity-90">
                <span className="text-cyber-text-muted font-semibold">Reasoning:</span> {threat.reasoning}
              </div>

              <div className="flex justify-between items-center text-[10px] text-cyber-text-muted border-t border-cyber-border/40 pt-1.5 mt-2">
                <span>Action: <strong className="text-cyber-text-primary">{threat.action}</strong></span>
                <span>Ollama AI Agent v1.0</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
