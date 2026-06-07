'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MetricsChart from '@/components/MetricsChart';
import { apiFetch } from '@/lib/api';
import { Shield, Play, Loader2, Award, Zap, Database } from 'lucide-react';

export default function Performance() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/benchmark/results');
      setResults(data);
    } catch (e) {
      console.error('Failed to load benchmark results:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunBenchmarks = async () => {
    setRunning(true);
    try {
      await apiFetch('/benchmark/run', { method: 'POST' });
      await fetchResults();
    } catch (e) {
      console.error('Failed to run benchmark suite:', e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-cyber-border/80 pb-4 gap-4">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-cyber-text-primary flex items-center gap-2">
              <Zap className="text-cyber-accent-blue" />
              Cryptographic Performance Benchmarking
            </h1>
            <p className="text-xs text-cyber-text-secondary mt-1 font-mono">
              Compare classical (X25519) and post-quantum (ML-KEM-768) hybrid key exchanges.
            </p>
          </div>
          <button
            id="run-benchmarks-btn"
            onClick={handleRunBenchmarks}
            disabled={running}
            className="bg-cyber-accent-blue/15 border border-cyber-accent-blue text-cyber-accent-blue font-bold px-5 py-2.5 rounded text-xs uppercase hover:bg-cyber-accent-blue hover:text-cyber-bg transition duration-200 cursor-pointer flex items-center gap-1.5 disabled:opacity-50 font-mono"
          >
            {running ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing Suite...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Benchmark Suite
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 font-mono text-cyber-accent-blue text-xs">
            [SYS] LOADING METRIC DATABASE...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Visual Charts */}
            <MetricsChart data={results} />

            {/* Metrics Table */}
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 overflow-x-auto glow-accent font-mono">
              <h3 className="text-cyber-accent text-xs font-bold uppercase mb-4 tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                Deployment Trade-off Matrix Data Table
              </h3>
              
              <table id="benchmark-results-table" className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-cyber-border/80 text-cyber-text-secondary uppercase text-[10px]">
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Profile</th>
                    <th className="py-2.5 px-3 text-right">KeyGen (ms)</th>
                    <th className="py-2.5 px-3 text-right">Handshake (ms)</th>
                    <th className="py-2.5 px-3 text-right">CPU (%)</th>
                    <th className="py-2.5 px-3 text-right">Memory (KB)</th>
                    <th className="py-2.5 px-3 text-right">Bandwidth (B)</th>
                    <th className="py-2.5 px-3 text-right">Security</th>
                    <th className="py-2.5 px-3 text-right text-cyber-accent">Deployment Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row.id} className="border-b border-cyber-border/40 hover:bg-cyber-bg/40 transition duration-150">
                      <td className="py-2.5 px-3 font-bold uppercase text-cyber-text-primary">
                        {row.mode}
                      </td>
                      <td className="py-2.5 px-3 text-cyber-text-secondary uppercase">
                        {row.network_profile}
                      </td>
                      <td className="py-2.5 px-3 text-right text-cyber-text-secondary">{row.keygen_ms}ms</td>
                      <td className="py-2.5 px-3 text-right text-cyber-text-secondary">{row.handshake_ms}ms</td>
                      <td className="py-2.5 px-3 text-right text-cyber-text-secondary">{row.cpu_pct}%</td>
                      <td className="py-2.5 px-3 text-right text-cyber-text-secondary">{row.memory_kb.toLocaleString()} KB</td>
                      <td className="py-2.5 px-3 text-right text-cyber-text-secondary">{row.bandwidth_bytes} B</td>
                      <td className="py-2.5 px-3 text-right text-cyber-accent-blue font-bold">{row.security_score}</td>
                      <td className="py-2.5 px-3 text-right text-cyber-accent font-bold">{row.deployment_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
