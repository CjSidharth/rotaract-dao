// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers'; // <-- IMPORT

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rotaract DAO',
  description: 'Governance for the Rotaract Ecosystem',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* <-- WRAP */}
      </body>
    </html>
  );
}
