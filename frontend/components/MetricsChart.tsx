'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface BenchmarkData {
  mode: string;
  network_profile: string;
  handshake_ms: number;
  cpu_pct: number;
  memory_kb: number;
  security_score: number;
  bandwidth_bytes: number;
  deployment_score: number;
}

interface MetricsChartProps {
  data: BenchmarkData[];
}

export default function MetricsChart({ data }: MetricsChartProps) {
  // Format data for Handshake Time BarChart
  // We want to group by network profile (normal, wan, mobile, adverse)
  // And have bars for x25519, mlkem768, hybrid
  const profiles = ['normal', 'wan', 'mobile', 'adverse'];
  const handshakeChartData = profiles.map(profile => {
    const x25519 = data.find(d => d.network_profile === profile && d.mode === 'x25519')?.handshake_ms || 0;
    const mlkem768 = data.find(d => d.network_profile === profile && d.mode === 'mlkem768')?.handshake_ms || 0;
    const hybrid = data.find(d => d.network_profile === profile && d.mode === 'hybrid')?.handshake_ms || 0;
    return {
      name: profile.toUpperCase(),
      X25519: x25519,
      'ML-KEM-768': mlkem768,
      Hybrid: hybrid
    };
  });

  // Bandwidth & Size metrics (static representation from first available)
  const sizeChartData = [
    { name: 'X25519', bandwidth: 64, memory: 128 },
    { name: 'ML-KEM-768', bandwidth: 2400, memory: 3168 },
    { name: 'Hybrid', bandwidth: 2464, memory: 3296 }
  ];

  // Tradeoff Radar Chart Data
  const radarData = [
    { subject: 'Security Level', X25519: 60, MLKEM: 90, Hybrid: 100 },
    { subject: 'Key Exchange Speed', X25519: 100, MLKEM: 30, Hybrid: 25 },
    { subject: 'Memory Efficiency', X25519: 100, MLKEM: 15, Hybrid: 10 },
    { subject: 'Bandwidth Conservation', X25519: 100, MLKEM: 20, Hybrid: 18 },
    { subject: 'Deployment Score', X25519: 80, MLKEM: 70, Hybrid: 75 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full font-mono">
      {/* Handshake Time Chart */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 glow-accent-blue">
        <h4 className="text-cyber-accent-blue text-xs font-bold uppercase mb-4 tracking-wider">
          Handshake Latency by Network Profile (ms)
        </h4>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={handshakeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d5a" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111a33', borderColor: '#1e2d5a', color: '#f8fafc' }}
                itemStyle={{ color: '#00ff9d' }}
              />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="X25519" fill="#f59e0b" name="X25519 (Classical)" />
              <Bar dataKey="ML-KEM-768" fill="#06b6d4" name="ML-KEM-768 (PQ)" />
              <Bar dataKey="Hybrid" fill="#10b981" name="Hybrid (Dual)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Security Tradeoff Radar Chart */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 glow-accent">
        <h4 className="text-cyber-accent text-xs font-bold uppercase mb-4 tracking-wider">
          Security / Performance Trade-Off Matrix
        </h4>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
              <PolarGrid stroke="#1e2d5a" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
              <Radar name="X25519" dataKey="X25519" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              <Radar name="ML-KEM-768" dataKey="MLKEM" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              <Radar name="Hybrid" dataKey="Hybrid" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#111a33', borderColor: '#1e2d5a' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Network Profile Latency Trend Line Chart */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 glow-accent lg:col-span-2">
        <h4 className="text-cyber-accent text-xs font-bold uppercase mb-4 tracking-wider">
          Key Exchange Bandwidth Size Comparison (Bytes)
        </h4>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sizeChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d5a" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111a33', borderColor: '#1e2d5a' }}
              />
              <Legend />
              <Bar dataKey="bandwidth" fill="#00e5ff" name="Transmission Size (Bytes)" />
              <Bar dataKey="memory" fill="#1e2d5a" name="Memory Usage (KB)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
