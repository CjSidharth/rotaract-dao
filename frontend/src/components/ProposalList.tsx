// src/components/ProposalList.tsx

'use client';

import { governorContract } from '@/lib/contractConfig';
import { ProposalCard } from './ProposalCard';
import { useState, useEffect } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { type Log } from 'viem'; // Import the base Log type

// Define the shape of our proposal data for state management
interface Proposal {
    proposalId: bigint;
    proposer: string;
    description: string;
}

// THIS IS THE KEY FIX:
// Create a specific type that combines the base Log properties
// with the exact `args` structure from your event.
type DecodedProposalCreatedLog = Log & {
    args: {
        proposalId: bigint;
        proposer: string;
        description: string;
    }
}

export function ProposalList() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const client = usePublicClient();

    // 1. WATCH for new proposals.
    useWatchContractEvent({
        address: governorContract.address,
        abi: governorContract.abi,
        eventName: 'ProposalCreated',
        onLogs(logs) {
            // Use a type assertion (`as`) to force the correct type onto the logs.
            const decodedLogs = logs as DecodedProposalCreatedLog[];

            const newProposals: Proposal[] = decodedLogs.map(log => ({
                // The '!' is still good practice, in case an arg is missing from a log.
                proposalId: log.args.proposalId!,
                proposer: log.args.proposer!,
                description: log.args.description!,
            }));
            
            setProposals(prev => {
                const existingIds = new Set(prev.map(p => p.proposalId.toString()));
                const uniqueNew = newProposals.filter(p => !existingIds.has(p.proposalId.toString()));
                return [...uniqueNew, ...prev];
            });
        },
    });

    // 2. FETCH all past proposals.
    useEffect(() => {
        const fetchPastProposals = async () => {
            if (!client) return;
            setIsLoading(true);
            try {
                const pastLogs = await client.getContractEvents({
                    address: governorContract.address,
                    abi: governorContract.abi,
                    eventName: 'ProposalCreated',
                    fromBlock: 0n,
                });

                // Apply the same type assertion here.
                const decodedLogs = pastLogs as DecodedProposalCreatedLog[];
                
                const pastProposals: Proposal[] = decodedLogs.map(log => ({
                    proposalId: log.args.proposalId!,
                    proposer: log.args.proposer!,
                    description: log.args.description!,
                })).reverse();

                setProposals(pastProposals);
            } catch (error) {
                console.error("Failed to fetch past proposals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPastProposals();
    }, [client]);

    // --- The rest of the component remains the same ---

    if (isLoading) {
        return <div className="text-center p-8">Loading proposals...</div>;
    }

    if (!isLoading && proposals.length === 0) {
        return <div className="text-center p-8 text-gray-500">No proposals found. Be the first to create one!</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Proposals</h2>
            {proposals.map((proposal) => (
                <ProposalCard
                    key={proposal.proposalId.toString()}
                    proposalId={proposal.proposalId}
                    description={proposal.description}
                    proposer={proposal.proposer}
                />
            ))}
        </div>
    );
}