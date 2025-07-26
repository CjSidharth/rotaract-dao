import { useReadContract } from 'wagmi';
import { governorContract } from '@/lib/contractConfig';
import Link from 'next/link';

interface ProposalCardProps {
    proposalId: bigint;
    description: string;
    proposer: string;
}

const stateInfo = [
    { text: "Pending", color: "bg-gradient-to-r from-yellow-100 to-amber-100", textColor: "text-yellow-800", border: "border-yellow-300", icon: "" },
    { text: "Active", color: "bg-gradient-to-r from-blue-100 to-cyan-100", textColor: "text-blue-800", border: "border-blue-300", icon: "" },
    { text: "Canceled", color: "bg-gradient-to-r from-gray-100 to-slate-100", textColor: "text-gray-800", border: "border-gray-300", icon: "" },
    { text: "Defeated", color: "bg-gradient-to-r from-red-100 to-rose-100", textColor: "text-red-800", border: "border-red-300", icon: "" },
    { text: "Succeeded", color: "bg-gradient-to-r from-green-100 to-emerald-100", textColor: "text-green-800", border: "border-green-300", icon: "" },
    { text: "Queued", color: "bg-gradient-to-r from-purple-100 to-violet-100", textColor: "text-purple-800", border: "border-purple-300", icon: "" },
    { text: "Expired", color: "bg-gradient-to-r from-orange-100 to-amber-100", textColor: "text-orange-800", border: "border-orange-300", icon: "" },
    { text: "Executed", color: "bg-gradient-to-r from-indigo-100 to-blue-100", textColor: "text-indigo-800", border: "border-indigo-300", icon: "" },
];

export function ProposalCard({ proposalId, description, proposer }: ProposalCardProps) {
    const { data: state, isLoading } = useReadContract({
        ...governorContract,
        functionName: 'state',
        args: [proposalId],
    });

    const currentState = (typeof state === 'number' && state >= 0 && state < stateInfo.length)
        ? stateInfo[state]
        : { text: "Loading...", color: "bg-gradient-to-r from-gray-100 to-slate-100", textColor: "text-gray-600", border: "border-gray-300", icon: "⏳" };

    const shortProposalId = `...${proposalId.toString().slice(-4)}`;

    return (
        <Link
            href={`/proposals/${proposalId.toString()}?description=${encodeURIComponent(description)}`}
            className="block group"
        >
            <div className="relative bg-gradient-to-br from-white/10 via-amber-50/10 to-yellow-50/10 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/30 hover:border-amber-400/50 transition-all duration-500 transform hover:scale-[1.02]">
                <div className="relative p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-white mb-2 break-words group-hover:text-amber-100 transition-colors duration-300 flex-1 pr-4">
                            {description}
                        </h3>
                        <div className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap border-2 ${currentState.color} ${currentState.textColor} ${currentState.border}`}>
                            <span>{currentState.text}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-amber-300/80 font-medium">Proposal ID:</span>
                            <code className="font-mono bg-amber-100/10 text-amber-200 px-3 py-1 rounded-lg border border-amber-400/30">
                                {shortProposalId}
                            </code>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-amber-300/80 font-medium">Proposed by:</span>
                            <code className="font-mono bg-amber-100/10 text-amber-200 px-3 py-1 rounded-lg border border-amber-400/30">
                                {proposer.slice(0, 6)}...{proposer.slice(-4)}
                            </code>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 transition-all duration-700 rounded-full"></div>
                </div>
            </div>
        </Link>
    );
}