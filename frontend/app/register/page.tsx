'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Key, User, Terminal } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Mainframe registration protocol rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 min-h-screen">
      <div className="w-full max-w-md bg-cyber-card border border-cyber-border rounded-xl p-8 glow-accent relative overflow-hidden font-mono">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent-blue/5 to-transparent h-1" />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-cyber-bg border border-cyber-border rounded-full mb-3">
            <Shield className="w-8 h-8 text-cyber-accent-blue animate-pulse" />
          </div>
          <h1 id="register-title" className="text-xl font-bold uppercase tracking-widest text-cyber-text-primary">
            REGISTER CREDENTIALS
          </h1>
          <p className="text-xs text-cyber-text-secondary mt-1 uppercase">
            Create simulated secure profile
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/20 border border-red-500/30 rounded text-red-400 text-xs flex gap-2 items-center">
            <Terminal className="w-4 h-4 shrink-0" />
            <span>ERROR: {error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[10px] text-cyber-text-secondary uppercase mb-1.5 font-bold">
              Desired Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-cyber-text-muted" />
              <input
                id="register-username"
                type="text"
                required
                className="w-full bg-cyber-bg border border-cyber-border rounded px-10 py-2.5 text-sm text-cyber-text-primary focus:outline-none focus:border-cyber-accent-blue transition duration-200"
                placeholder="Select username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-cyber-text-secondary uppercase mb-1.5 font-bold">
              Operator Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-cyber-text-muted" />
              <input
                id="register-password"
                type="password"
                required
                className="w-full bg-cyber-bg border border-cyber-border rounded px-10 py-2.5 text-sm text-cyber-text-primary focus:outline-none focus:border-cyber-accent-blue transition duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-cyber-text-secondary uppercase mb-1.5 font-bold">
              Confirm Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-cyber-text-muted" />
              <input
                id="register-confirm-password"
                type="password"
                required
                className="w-full bg-cyber-bg border border-cyber-border rounded px-10 py-2.5 text-sm text-cyber-text-primary focus:outline-none focus:border-cyber-accent-blue transition duration-200"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-cyber-accent-blue/15 border border-cyber-accent-blue text-cyber-accent-blue py-3 rounded-md hover:bg-cyber-accent-blue hover:text-cyber-bg font-bold tracking-widest uppercase transition-all duration-300 glow-accent-blue text-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? 'ENROLLING PROTOCOLS...' : 'ENROLL CREDENTIALS'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-cyber-text-secondary pt-4 border-t border-cyber-border/40">
          Already registered?{' '}
          <Link href="/" className="text-cyber-accent hover:underline">
            Terminal Access
          </Link>
        </div>
      </div>
    </div>
  );
}
