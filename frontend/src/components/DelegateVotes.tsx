'use client';

import { useWriteContract, useAccount } from 'wagmi';
import { tokenContract } from '@/lib/contractConfig';
import { useQueryClient } from '@tanstack/react-query';

export function DelegateVotes() {
    const { address, isConnected } = useAccount();
    const { writeContract, isPending } = useWriteContract();
    const queryClient = useQueryClient();

    const handleDelegate = () => {
        if (!isConnected || !address) {
            alert('Please connect your wallet first.');
            return;
        }

        console.log("Attempting to delegate for address:", address);

        writeContract({
            ...tokenContract,
            functionName: 'delegate',
            args: [address],
        }, {
            onSuccess: (hash) => {
                alert('Transaction submitted! Your voting power will update after confirmation.');
                console.log('Delegation transaction submitted with hash:', hash);
            },
            onError: (error) => {
                console.error("Delegation Error:", error);
                alert(`Delegation failed: ${error.message}`);
            },
            onSettled: () => {
                console.log('Transaction settled. Invalidating queries for getVotes.');
                queryClient.invalidateQueries({
                    queryKey: ['readContract', { functionName: 'getVotes', address: tokenContract.address }]
                });
            }
        });
    };

    return (
        <button
            onClick={handleDelegate}
            disabled={!isConnected || isPending}
            className="relative inline-flex items-center px-8 py-4 border-2 border-amber-400/50 text-base font-semibold rounded-xl text-blue-900 bg-amber-100 hover:bg-amber-200 hover:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
            <svg 
                className={`w-5 h-5 mr-3 ${isPending ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                {isPending ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
            </svg>
            <span className="relative z-10">
                {isPending ? 'Delegating...' : 'Delegate Votes'}
            </span>
        </button>
    );
}