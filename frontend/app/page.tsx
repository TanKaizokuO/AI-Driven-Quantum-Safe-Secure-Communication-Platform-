'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Key, User, Terminal } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists, direct to dashboard
    if (localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Connection refused by mainframe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative min-h-screen">
      <div className="w-full max-w-md bg-cyber-card border border-cyber-border rounded-xl p-8 glow-accent relative overflow-hidden font-mono">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent/5 to-transparent h-1" />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-cyber-bg border border-cyber-border rounded-full mb-3">
            <Shield className="w-8 h-8 text-cyber-accent animate-pulse" />
          </div>
          <h1 id="landing-title" className="text-xl font-bold uppercase tracking-widest text-cyber-text-primary">
            QUANTUM-SAFE SYSTEM
          </h1>
          <p className="text-xs text-cyber-text-secondary mt-1 uppercase">
            Simulated Hybrid Cryptographic Core
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/20 border border-red-500/30 rounded text-red-400 text-xs flex gap-2 items-center">
            <Terminal className="w-4 h-4 shrink-0" />
            <span>ERROR: {error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] text-cyber-text-secondary uppercase mb-1.5 font-bold">
              Operator Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-cyber-text-muted" />
              <input
                id="login-username"
                type="text"
                required
                className="w-full bg-cyber-bg border border-cyber-border rounded px-10 py-2.5 text-sm text-cyber-text-primary focus:outline-none focus:border-cyber-accent-blue transition duration-200"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-cyber-text-secondary uppercase mb-1.5 font-bold">
              Access Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-cyber-text-muted" />
              <input
                id="login-password"
                type="password"
                required
                className="w-full bg-cyber-bg border border-cyber-border rounded px-10 py-2.5 text-sm text-cyber-text-primary focus:outline-none focus:border-cyber-accent-blue transition duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-cyber-accent/15 border border-cyber-accent text-cyber-accent py-3 rounded-md hover:bg-cyber-accent hover:text-cyber-bg font-bold tracking-widest uppercase transition-all duration-300 glow-accent text-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? 'NEGOTIATING PORTALS...' : 'INITIALIZE SESSION'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-cyber-text-secondary pt-4 border-t border-cyber-border/40">
          New operator?{' '}
          <Link id="register-link" href="/register" className="text-cyber-accent-blue hover:underline">
            Register Credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
