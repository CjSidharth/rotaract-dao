// src/components/Navbar.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export function Navbar() {
    return (
        <nav className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
            <Link href="/" className="text-xl font-bold text-blue-700 hover:text-blue-500">
                RotaractDAO
            </Link>
            <ConnectButton />
        </nav>
    );
}
