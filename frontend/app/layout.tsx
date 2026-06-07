import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Quantum-Safe Hybrid Communication Platform (Demo Simulation)',
  description: 'Research demonstration showcasing ML-KEM-768 & X25519 hybrid cryptography, AI-driven key rotation, and network simulation.',
  keywords: ['quantum cryptography', 'ML-KEM-768', 'post-quantum cryptography', 'hybrid key encapsulation', 'cybersecurity demo'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-cyber-bg text-cyber-text-primary cyber-grid scanline relative">
        <main className="flex-1 flex flex-col z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
