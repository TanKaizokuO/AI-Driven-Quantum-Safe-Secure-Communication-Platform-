'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import KeygenAnimation from '@/components/KeygenAnimation';
import HandshakeVisualizer from '@/components/HandshakeVisualizer';
import { apiFetch } from '@/lib/api';
import { SessionSocket } from '@/lib/websocket';
import { Shield, Key, Send, AlertCircle, Info, Lock } from 'lucide-react';

interface ChatMessage {
  sender: string;
  plaintext: string;
  ciphertext?: string;
  iv?: string;
  tag?: string;
  status: 'encrypting' | 'encrypted' | 'decrypted';
}

export default function Chat() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [handshakeComplete, setHandshakeComplete] = useState(false);
  const [networkProfile, setNetworkProfile] = useState('normal');
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<SessionSocket | null>(null);
  const [username, setUsername] = useState('');
  
  const [encryptionMetrics, setEncryptionMetrics] = useState<any>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auth Guard
    const storedUsername = localStorage.getItem('username');
    if (!localStorage.getItem('token') || !storedUsername) {
      router.push('/');
      return;
    }
    setUsername(storedUsername);

    if (!sessionId) {
      router.push('/dashboard');
      return;
    }

    // Get session metadata
    apiFetch(`/session/connect`, {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, username: storedUsername })
    })
    .then((details) => {
      setSessionDetails(details);
      setNetworkProfile(details.network_profile);
    })
    .catch((err) => {
      console.error(err);
      router.push('/dashboard');
    });

  }, [sessionId, router]);

  // Setup WebSocket connection once handshake completes
  useEffect(() => {
    if (!handshakeComplete || !sessionId || !username) return;

    const onMessageReceived = (data: any) => {
      if (data.type === 'message') {
        // We simulate a decryption step for 250ms
        const newMsg: ChatMessage = {
          sender: data.sender,
          plaintext: data.plaintext,
          ciphertext: data.ciphertext,
          iv: data.iv,
          tag: data.tag,
          status: 'encrypting' // show decryption progress
        };
        setMessages((prev) => [...prev, newMsg]);

        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1 ? { ...msg, status: 'decrypted' } : msg
            )
          );
        }, 300);
      }
    };

    const ws = new SessionSocket(sessionId, onMessageReceived);
    ws.connect();
    setSocket(ws);

    return () => ws.close();
  }, [handshakeComplete, sessionId, username]);

  // Scroll to bottom on messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText('');

    // Pre-insert simulated "encrypting" stage
    const placeholderMsg: ChatMessage = {
      sender: username,
      plaintext: text,
      status: 'encrypting'
    };
    
    setMessages((prev) => [...prev, placeholderMsg]);
    const currentIdx = messages.length;

    try {
      // API call to encrypt message
      const result = await apiFetch('/message/send', {
        method: 'POST',
        body: JSON.stringify({
          session_id: sessionId,
          sender: username,
          plaintext: text
        })
      });

      setEncryptionMetrics({
        time_ms: result.encrypt_time_ms,
        iv: result.iv,
        tag: result.tag,
        ciphertext: result.ciphertext
      });

      // Update message state in list to "encrypted"
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === currentIdx
            ? {
                ...msg,
                ciphertext: result.ciphertext,
                iv: result.iv,
                tag: result.tag,
                status: 'encrypted'
              }
            : msg
        )
      );

      // Broadcast through websocket
      if (socket) {
        socket.send({
          type: 'message',
          sender: username,
          plaintext: text,
          ciphertext: result.ciphertext,
          iv: result.iv,
          tag: result.tag
        });
      }

    } catch (err) {
      console.error('Failed to encrypt/send message:', err);
    }
  };

  if (!sessionId) return null;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      {!handshakeComplete ? (
        <div className="flex-1 flex justify-center items-center p-6">
          <KeygenAnimation
            networkProfile={networkProfile}
            onComplete={() => setHandshakeComplete(true)}
          />
        </div>
      ) : (
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          {/* Chat Pane */}
          <div className="lg:col-span-2 bg-cyber-card border border-cyber-border rounded-xl flex flex-col h-[75vh] glow-accent-blue overflow-hidden">
            {/* Chat header */}
            <div className="bg-cyber-bg/80 border-b border-cyber-border/80 p-4 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <Lock className="text-cyber-accent w-4 h-4" />
                <span className="font-bold text-cyber-text-primary uppercase">
                  PQ Tunnel Established: {sessionId.substring(0, 12)}...
                </span>
              </div>
              <span className="bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent px-2 py-0.5 rounded text-[10px] uppercase">
                HYBRID (ML-KEM + X25519)
              </span>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-cyber-text-muted text-xs py-12">
                  [SYS] Tunnel secure. Send a message to initiate simulated encryption stream.
                </div>
              )}
              {messages.map((msg, idx) => {
                const isMe = msg.sender === username;
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-cyber-text-secondary mb-1">
                      {msg.sender}
                    </div>
                    <div className={`p-3 rounded-lg max-w-[85%] text-xs border ${
                      isMe 
                        ? 'bg-cyber-accent-blue/15 border-cyber-accent-blue/30 text-cyber-text-primary' 
                        : 'bg-cyber-card border-cyber-border text-cyber-text-primary'
                    }`}>
                      <p>{msg.plaintext}</p>
                      
                      {/* Simulated Ciphertext info block */}
                      {msg.status === 'encrypting' ? (
                        <span className="text-[9px] text-cyber-accent-yellow block mt-2 animate-pulse">
                          ⚡ Processing AES-256-GCM cipher...
                        </span>
                      ) : (
                        <div className="mt-2 pt-2 border-t border-cyber-border/40 text-[9px] text-cyber-text-muted space-y-0.5">
                          <p className="break-all font-mono">
                            CIPHER: {msg.ciphertext?.substring(0, 32)}...
                          </p>
                          <p>IV: {msg.iv?.substring(0, 12)}... | TAG: {msg.tag?.substring(0, 8)}...</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-cyber-bg/40 border-t border-cyber-border/85 flex gap-2">
              <input
                id="chat-message-input"
                type="text"
                required
                placeholder="Type secure message..."
                className="flex-1 bg-cyber-bg border border-cyber-border rounded px-4 py-2.5 text-xs text-cyber-text-primary focus:outline-none focus:border-cyber-accent-blue font-mono"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                id="chat-send-btn"
                type="submit"
                className="bg-cyber-accent/15 border border-cyber-accent text-cyber-accent px-4 py-2 rounded hover:bg-cyber-accent hover:text-cyber-bg transition duration-200 cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Session Detail Sidebar Pane */}
          <div className="space-y-6">
            {/* Encryption stats */}
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 glow-accent font-mono text-xs">
              <h3 className="text-cyber-accent text-xs font-bold uppercase border-b border-cyber-border/80 pb-2 mb-3 tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyber-accent" />
                Session Info Panel
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-cyber-text-secondary block">Session ID:</span>
                  <span id="session-id-display" className="text-cyber-text-primary font-bold break-all select-all font-mono text-[10px]">
                    {sessionId}
                  </span>
                </div>
                <div>
                  <span className="text-cyber-text-secondary block">Algorithm:</span>
                  <span className="text-cyber-accent font-semibold">Hybrid X25519 + ML-KEM-768</span>
                </div>
                <div>
                  <span className="text-cyber-text-secondary block">Shared Secret Hash:</span>
                  <span id="session-secret-hash" className="text-cyber-text-primary font-mono select-all text-[10px] break-all">
                    {sessionDetails?.shared_secret_hash || '7f3ad901...'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-cyber-border/30 pt-2.5 mt-2">
                  <span>Messages Sent:</span>
                  <span className="font-bold text-cyber-accent-blue">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rotations Count:</span>
                  <span className="font-bold text-cyber-accent-yellow">1</span>
                </div>
              </div>
            </div>

            {/* Interactive Handshake Diagram */}
            <HandshakeVisualizer />
          </div>
        </div>
      )}
    </div>
  );
}
