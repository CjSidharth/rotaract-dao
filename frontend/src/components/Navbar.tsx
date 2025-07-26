'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export function Navbar() {
    return (
        <nav className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl border-b border-amber-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-yellow-400/10 to-amber-400/5 opacity-50"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo Section with Rotaract PNG Logo */}
                    <Link href="/" className="group flex items-center space-x-3 hover:scale-105 transform transition-all duration-300">
                        <div className="relative">
                            <img src="/rotaract-logo.png" alt="Rotaract Logo" className="w-12 h-12 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300" />
                        </div>
                        
                        <div>
                            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 group-hover:from-yellow-400 group-hover:via-amber-500 group-hover:to-yellow-600 transition-all duration-300">
                                RotaractDAO
                            </div>
                            <div className="text-xs text-amber-300/80 font-medium -mt-1 group-hover:text-amber-300 transition-colors duration-300">
                                Service Above Self
                            </div>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            href="/" 
                            className="group relative text-gray-300 hover:text-amber-400 font-medium transition-colors duration-300"
                        >
                            Dashboard
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link 
                            href="/create-proposal" 
                            className="group relative text-gray-300 hover:text-amber-400 font-medium transition-colors duration-300"
                        >
                            Proposals
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </div>

                    {/* Connect Button */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <ConnectButton.Custom>
                                {({
                                    account,
                                    chain,
                                    openAccountModal,
                                    openChainModal,
                                    openConnectModal,
                                    authenticationStatus,
                                    mounted,
                                }) => {
                                    const ready = mounted && authenticationStatus !== 'loading';
                                    const connected =
                                        ready &&
                                        account &&
                                        chain &&
                                        (!authenticationStatus ||
                                            authenticationStatus === 'authenticated');

                                    return (
                                        <div
                                            {...(!ready && {
                                                'aria-hidden': true,
                                                'style': {
                                                    opacity: 0,
                                                    pointerEvents: 'none',
                                                    userSelect: 'none',
                                                },
                                            })}
                                        >
                                            {(() => {
                                                if (!connected) {
                                                    return (
                                                        <button
                                                            onClick={openConnectModal}
                                                            type="button"
                                                            className="group relative inline-flex items-center px-6 py-3 border-2 border-amber-400/50 text-sm font-semibold rounded-xl text-amber-400 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 hover:from-amber-400/20 hover:to-yellow-500/20 hover:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transform hover:scale-105 transition-all duration-300"
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            Connect Wallet
                                                        </button>
                                                    );
                                                }

                                                if (chain.unsupported) {
                                                    return (
                                                        <button
                                                            onClick={openChainModal}
                                                            type="button"
                                                            className="inline-flex items-center px-6 py-3 border-2 border-red-400/50 text-sm font-semibold rounded-xl text-red-400 bg-gradient-to-r from-red-400/10 to-red-500/10 hover:from-red-400/20 hover:to-red-500/20 hover:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-500/30 transform hover:scale-105 transition-all duration-300"
                                                        >
                                                            Wrong network
                                                        </button>
                                                    );
                                                }

                                                return (
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={openChainModal}
                                                            type="button"
                                                            className="group relative inline-flex items-center px-4 py-2 border border-amber-400/30 text-sm font-medium rounded-lg text-amber-400 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 hover:from-amber-400/20 hover:to-yellow-500/20 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                                        >
                                                            {chain.hasIcon && (
                                                                <div className="w-4 h-4 mr-2 rounded-full overflow-hidden">
                                                                    {chain.iconUrl && (
                                                                        <img
                                                                            alt={chain.name ?? 'Chain icon'}
                                                                            src={chain.iconUrl}
                                                                            className="w-4 h-4"
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                            {chain.name}
                                                        </button>

                                                        <button
                                                            onClick={openAccountModal}
                                                            type="button"
                                                            className="group relative inline-flex items-center px-4 py-2 border border-amber-400/30 text-sm font-medium rounded-lg text-amber-400 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 hover:from-amber-400/20 hover:to-yellow-500/20 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                                        >
                                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                                            {account.displayName}
                                                            {account.displayBalance
                                                                ? ` (${account.displayBalance})`
                                                                : ''}
                                                        </button>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    );
                                }}
                            </ConnectButton.Custom>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}