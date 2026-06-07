'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, LayoutDashboard, MessageSquare, BarChart3, AlertTriangle, PlayCircle, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('username');
      setUsername(stored);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, id: 'nav-link-dashboard' },
    { name: 'Encrypted Chat', href: '/chat', icon: MessageSquare, id: 'nav-link-chat' },
    { name: 'Benchmarks', href: '/performance', icon: BarChart3, id: 'nav-link-performance' },
    { name: 'AI Threat Feed', href: '/threats', icon: AlertTriangle, id: 'nav-link-threats' },
    { name: 'Research Runner', href: '/experiment', icon: PlayCircle, id: 'nav-link-experiment' },
  ];

  return (
    <header className="bg-cyber-card/80 backdrop-blur border-b border-cyber-border/80 sticky top-0 z-50 px-6 py-3 flex justify-between items-center font-mono">
      <div className="flex items-center gap-3">
        <Shield className="text-cyber-accent w-6 h-6 animate-pulse" />
        <span className="font-bold text-cyber-accent text-sm tracking-widest uppercase">
          QuantumSec v1.0
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-1 text-xs">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              id={item.id}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md border transition-all duration-200 ${
                isActive
                  ? 'bg-cyber-accent/10 border-cyber-accent text-cyber-accent glow-accent'
                  : 'border-transparent text-cyber-text-secondary hover:text-cyber-text-primary hover:bg-cyber-bg/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4 text-xs">
        {username && (
          <span className="text-cyber-text-secondary border-r border-cyber-border/80 pr-4">
            Operator: <span className="text-cyber-accent-blue font-bold">{username}</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          id="logout-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-cyber-border text-cyber-text-secondary hover:border-cyber-accent-red hover:text-cyber-accent-red transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
}
