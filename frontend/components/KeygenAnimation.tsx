'use client';

import React, { useState, useEffect } from 'react';

interface KeygenStep {
  label: string;
  duration: number;
  hexPreview?: string;
}

interface KeygenAnimationProps {
  onComplete: () => void;
  networkProfile: string;
}

export default function KeygenAnimation({ onComplete, networkProfile }: KeygenAnimationProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<KeygenStep[]>([
    { label: 'Initializing Hybrid KEM Cryptographic Engine...', duration: 600 },
    { label: 'Generating classical X25519 Ephemeral Keypair...', duration: 800, hexPreview: '4e3a9c7b2f15e8d0d9382f1b0a8c7e6d5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e' },
    { label: 'Generating Post-Quantum ML-KEM-768 Keypair...', duration: 1200, hexPreview: 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90...' },
    { label: 'Performing Post-Quantum Key Encapsulation...', duration: 1000, hexPreview: 'eb4f91d0e402a7b8dfa32b0cde8394fe9b023de495acbde0492abfe0349b1029c7823abfde80293abd0293cdb129a029cde0b029ff3d02a938cbe0293bd8293ab...' },
    { label: 'Decrypting/Decapsulating Shared Secret key...', duration: 900 },
    { label: 'Deriving hybrid 256-bit symmetric key via HKDF-SHA256...', duration: 700, hexPreview: '8f921d7b0a3c9e2b1f8d4a6e5c7b3a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b' },
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const runNextStep = (index: number) => {
      if (index >= steps.length) {
        onComplete();
        return;
      }
      
      timer = setTimeout(() => {
        setActiveStep(index + 1);
        runNextStep(index + 1);
      }, steps[index].duration);
    };

    runNextStep(0);

    return () => clearTimeout(timer);
  }, [steps, onComplete]);

  return (
    <div className="w-full max-w-2xl bg-cyber-card border border-cyber-border rounded-xl p-6 glow-accent-blue font-mono relative overflow-hidden">
      {/* Scanning bar effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-accent/5 to-transparent h-1/2 w-full animate-pulse-slow pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-4">
        <h3 className="text-cyber-accent-blue text-sm font-bold tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 bg-cyber-accent-blue rounded-full animate-ping" />
          KEM Handshake Negotiation Pipeline
        </h3>
        <span className="text-xs text-cyber-text-secondary bg-cyber-bg px-2 py-1 border border-cyber-border rounded">
          Network Profile: <span className="text-cyber-accent font-semibold">{networkProfile.toUpperCase()}</span>
        </span>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isPending = idx > activeStep;
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;

          return (
            <div key={idx} className={`transition-all duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
              <div className="flex items-start justify-between text-xs gap-3">
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 font-bold ${isCompleted ? 'text-cyber-accent' : isActive ? 'text-cyber-accent-blue animate-pulse' : 'text-cyber-text-muted'}`}>
                    {isCompleted ? '[✓]' : isActive ? '[>]' : '[ ]'}
                  </span>
                  <div>
                    <p className={`font-semibold ${isActive ? 'text-cyber-text-primary' : isCompleted ? 'text-cyber-text-secondary' : 'text-cyber-text-muted'}`}>
                      {step.label}
                    </p>
                    {step.hexPreview && isCompleted && (
                      <div className="mt-1 bg-cyber-bg/60 p-2 rounded border border-cyber-border/40 text-[10px] break-all text-cyber-accent/80 select-all">
                        HEX: {step.hexPreview}
                      </div>
                    )}
                    {step.hexPreview && isActive && (
                      <div className="mt-1 bg-cyber-bg/30 p-2 rounded border border-cyber-border/20 text-[10px] break-all text-cyber-accent-blue/50 animate-pulse">
                        Generating data streams...
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-cyber-text-muted shrink-0 font-semibold">
                  {step.duration}ms
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
