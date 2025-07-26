// src/components/ProposalCard.tsx  <- MAKE SURE IT'S SAVED HERE

import { useReadContract } from 'wagmi';
import { governorContract } from '@/lib/contractConfig';
import Link from 'next/link';

// Define the props it will accept
interface ProposalCardProps {
    proposalId: bigint;
    description: string;
    proposer: string;
}

// FIX FOR ERROR #2: Use an Array.
// Arrays are indexed by numbers, which is what `state` is. This is cleaner and type-safe.
const stateInfo = [
    { text: "Pending", color: "bg-yellow-100 text-yellow-800" },      // 0
    { text: "Active", color: "bg-blue-100 text-blue-800" },         // 1
    { text: "Canceled", color: "bg-gray-100 text-gray-800" },       // 2
    { text: "Defeated", color: "bg-red-100 text-red-800" },         // 3
    { text: "Succeeded", color: "bg-green-100 text-green-800" },     // 4
    { text: "Queued", color: "bg-purple-100 text-purple-800" },     // 5
    { text: "Expired", color: "bg-orange-100 text-orange-800" },    // 6
    { text: "Executed", color: "bg-indigo-100 text-indigo-800" },    // 7
];

// NOTICE THE 'export' KEYWORD HERE
export function ProposalCard({ proposalId, description, proposer }: ProposalCardProps) {
    const { data: state, isLoading } = useReadContract({
        ...governorContract,
        functionName: 'state',
        args: [proposalId],
    });

    // Default to a loading state if data isn't ready
    const currentState = (typeof state === 'number' && state >= 0 && state < stateInfo.length)
        ? stateInfo[state]
        : { text: "Loading...", color: "bg-gray-100" };

    const shortProposalId = `...${proposalId.toString().slice(-4)}`;

    return (
        // Wrap with Link to make the whole card clickable
        <Link
            href={`/proposals/${proposalId.toString()}?description=${encodeURIComponent(description)}`}
            className="block"
        >
            <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 break-words">{description}</h3>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${currentState.color}`}>
                        {currentState.text}
                    </span>
                </div>
                <div className="text-sm text-gray-500">
                    <p>Proposal ID: <code className="font-mono bg-gray-100 p-1 rounded">{shortProposalId}</code></p>
                    <p>Proposed by: <code className="font-mono bg-gray-100 p-1 rounded">{proposer.slice(0, 6)}...{proposer.slice(-4)}</code></p>
                </div>
            </div>
        </Link>
    );
}
