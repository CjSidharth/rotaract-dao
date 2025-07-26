// src/app/proposals/[proposalId]/page.tsx
'use client';

import { Navbar } from '@/components/Navbar';
import { governorContract, treasuryContract } from '@/lib/contractConfig'; // Import treasuryContract
import { useReadContract, useWriteContract, useWatchBlocks, usePublicClient } from 'wagmi';
import { useParams, useSearchParams } from 'next/navigation';
import { formatEther, keccak256, toBytes, type Block, type Log } from 'viem'; // Import all needed types/functions
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

// --- Helper Types ---

// Define the precise structure of the event log's args
type ProposalCreatedLogArgs = {
    proposalId?: bigint;
    proposer?: string;
    targets?: readonly `0x${string}`[];
    values?: readonly bigint[];
    calldatas?: readonly `0x${string}`[];
    description?: string;
};

// Combine the base Log type with our specific args
type DecodedProposalCreatedLog = Log & {
    args: ProposalCreatedLogArgs;
};

// Define the structure for the data we want to store in state
type ProposalData = {
    targets: readonly `0x${string}`[];
    values: readonly bigint[];
    calldatas: readonly `0x${string}`[];
};

const stateInfo = [
    { text: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { text: "Active", color: "bg-blue-100 text-blue-800" },
    { text: "Canceled", color: "bg-gray-100 text-gray-800" },
    { text: "Defeated", color: "bg-red-100 text-red-800" },
    { text: "Succeeded", color: "bg-green-100 text-green-800" },
    { text: "Queued", color: "bg-purple-100 text-purple-800" },
    { text: "Expired", color: "bg-orange-100 text-orange-800" },
    { text: "Executed", color: "bg-indigo-100 text-indigo-800" },
];

export default function ProposalDetailPage() {
    // --- Hooks and Initial State ---
    const params = useParams();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const publicClient = usePublicClient();

    const proposalId = BigInt(params.proposalId as string);
    const description = searchParams.get('description');

    const [proposalData, setProposalData] = useState<ProposalData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // --- Data Fetching from Smart Contract ---
    const { data: proposalState, queryKey: stateQueryKey } = useReadContract({
        ...governorContract,
        functionName: 'state',
        args: [proposalId],
    });

    const { data: proposalVotes, isLoading: isLoadingVotes, queryKey: votesQueryKey } = useReadContract({
        ...governorContract,
        functionName: 'proposalVotes',
        args: [proposalId],
    });

    const { data: deadline } = useReadContract({
        ...governorContract,
        functionName: 'proposalDeadline',
        args: [proposalId]
    });

    // --- Data Fetching from Event Logs ---
    useEffect(() => {
        if (!publicClient || !proposalId) return;

        const fetchProposalLog = async () => {
            setIsLoadingData(true);
            try {
                const logs = await publicClient.getContractEvents({
                    address: governorContract.address,
                    abi: governorContract.abi,
                    eventName: 'ProposalCreated',
                    fromBlock: 0n, // Search the entire chain history
                });
                
                const decodedLogs = logs as DecodedProposalCreatedLog[];
                const proposalLog = decodedLogs.find(log => log.args.proposalId === proposalId);

                if (proposalLog?.args) {
                    setProposalData({
                        targets: proposalLog.args.targets!,
                        values: proposalLog.args.values!,
                        calldatas: proposalLog.args.calldatas!,
                    });
                } else {
                    console.error("Could not find the event log for this proposal.");
                }
            } catch (error) {
                console.error("Failed to fetch proposal logs:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchProposalLog();
    }, [publicClient, proposalId]);

    // --- Auto-refresh UI on new blocks ---
    useWatchBlocks({
        onBlock: (block: Block) => {
            console.log('New block detected:', block.number, 'Refetching proposal data...');
            queryClient.invalidateQueries({ queryKey: stateQueryKey });
            queryClient.invalidateQueries({ queryKey: votesQueryKey });
        },
    });

    const { writeContract, isPending } = useWriteContract();

    // --- Action Handlers ---
    const handleVote = (voteWay: 0 | 1 | 2) => {
        writeContract({
            ...governorContract,
            functionName: 'castVote',
            args: [proposalId, voteWay],
        }, {
            onSuccess: () => alert("Vote transaction submitted!"),
            onError: (err) => alert(`Error: ${err.message}`),
        });
    };

    const handleQueue = () => {
        if (!proposalData) {
            alert("Proposal data is still loading or could not be found. Please wait a moment.");
            return;
        }
        if (!description) {
            alert("Proposal description is missing.");
            return;
        }
        const descriptionHash = keccak256(toBytes(description));

        writeContract({
            ...governorContract,
            functionName: 'queue',
            args: [proposalData.targets, proposalData.values, proposalData.calldatas, descriptionHash],
        }, {
            onSuccess: () => alert("Proposal queued successfully!"),
            onError: (err) => alert(`Queueing failed: ${err.message}`),
        });
    };

    const handleExecute = () => {
        if (!proposalData) {
            alert("Proposal data is still loading or could not be found. Please wait a moment.");
            return;
        }
        if (!description) {
            alert("Proposal description is missing.");
            return;
        }
        const descriptionHash = keccak256(toBytes(description));

        writeContract({
            ...governorContract,
            functionName: 'execute',
            args: [proposalData.targets, proposalData.values, proposalData.calldatas, descriptionHash],
        }, {
            onSuccess: () => {
                alert("Proposal executed successfully! Funds should now be transferred.");
                // Invalidate the treasury balance on the main dashboard page
                queryClient.invalidateQueries({ queryKey: ['balance'] });
            },
            onError: (err) => alert(`Execution failed: ${err.message}`),
        });
    };

    // --- Render Helpers ---
    const currentState = (typeof proposalState === 'number') ? stateInfo[proposalState] : { text: 'Loading...', color: 'bg-gray-100' };
    const [againstVotes, forVotes, abstainVotes] = Array.isArray(proposalVotes) ? proposalVotes : [0n, 0n, 0n];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white p-8 rounded-lg shadow-md border">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 break-words">
                            {description || "Loading description..."}
                        </h1>
                        <span className={`px-4 py-2 text-sm font-semibold rounded-full ${currentState.color}`}>
                            {currentState.text}
                        </span>
                    </div>

                    <p className="text-gray-600 mb-6 border-b pb-4">Proposal ID: <code className="font-mono">{proposalId.toString()}</code></p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-green-800">For</p>
                            <p className="text-2xl font-bold text-green-900">{isLoadingVotes ? '...' : formatEther(forVotes)}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-sm font-medium text-red-800">Against</p>
                            <p className="text-2xl font-bold text-red-900">{isLoadingVotes ? '...' : formatEther(againstVotes)}</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm font-medium text-gray-800">Abstain</p>
                            <p className="text-2xl font-bold text-gray-900">{isLoadingVotes ? '...' : formatEther(abstainVotes)}</p>
                        </div>
                    </div>

                    {deadline != null && (
                        <div className="text-center text-gray-500 mb-8">
                            Voting ends on block: {deadline.toString()}
                        </div>
                    )}

                    <div className="mt-6">
                        {proposalState === 1 && (
                            <div className="flex justify-center space-x-4">
                                <button onClick={() => handleVote(1)} disabled={isPending} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50">
                                    {isPending ? 'Confirming...' : 'Vote For'}
                                </button>
                                <button onClick={() => handleVote(0)} disabled={isPending} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:opacity-50">
                                    {isPending ? 'Confirming...' : 'Vote Against'}
                                </button>
                                <button onClick={() => handleVote(2)} disabled={isPending} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 disabled:opacity-50">
                                    {isPending ? 'Confirming...' : 'Abstain'}
                                </button>
                            </div>
                        )}

                        {proposalState === 4 && (
                            <div className="text-center">
                                <button onClick={handleQueue} disabled={isPending || isLoadingData} className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-wait">
                                    {isLoadingData ? 'Loading Data...' : isPending ? 'Queuing...' : 'Queue Proposal'}
                                </button>
                            </div>
                        )}

                        {proposalState === 5 && (
                            <div className="text-center">
                                <button onClick={handleExecute} disabled={isPending || isLoadingData} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait">
                                    {isLoadingData ? 'Loading Data...' : isPending ? 'Executing...' : 'Execute Proposal'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}