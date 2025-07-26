// src/app/providers.tsx
'use client'; // This must be a client component

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { anvil } from 'wagmi/chains'; // We'll use the pre-configured Anvil chain
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 1. Get a project ID from https://cloud.walletconnect.com
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

// 2. Set up wagmi config
const config = getDefaultConfig({
    appName: 'Rotaract DAO',
    projectId,
    chains: [anvil], // We are only using the local Anvil chain
    ssr: true, // Enable Server-Side Rendering for Next.js
});

const queryClient = new QueryClient();

// 3. Create the provider component
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
