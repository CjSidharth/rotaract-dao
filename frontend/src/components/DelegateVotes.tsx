// src/components/DelegateVotes.tsx
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
            // onSettled runs after a transaction is either successful or fails.
            // It's the perfect place for invalidation logic.
            onSettled: () => {
                console.log('Transaction settled. Invalidating queries for getVotes.');

                // THE ROBUST FIX: Use a partial query key.
                // This finds all queries for the 'getVotes' function on this contract,
                // regardless of the `args`, and marks them as stale.
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
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? 'Confirming...' : 'Delegate Votes'}
        </button>
    );
}
