// src/components/DAOStats.tsx
'use client';

import { useBalance, useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { tokenContract, treasuryContract } from '@/lib/contractConfig';

// A reusable card component for consistent, stylish stats
const StatCard = ({ title, value, unit }: { title: string, value: string | React.ReactNode, unit?: string }) => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300">
            <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
            <div className="mt-2 text-4xl font-extrabold text-gray-800">
                {value}
                {unit && <span className="ml-2 text-2xl font-bold text-gray-400">{unit}</span>}
            </div>
        </div>
    );
};

// A skeleton loader for a better loading experience
const SkeletonLoader = () => <div className="h-10 bg-gray-200 rounded-md animate-pulse w-3/4 mt-2"></div>;

export function DAOStats() {
    const { address: userAddress } = useAccount();

    const { data: treasuryBalance, isLoading: isTreasuryLoading } = useBalance({
        address: treasuryContract.address,
    });

    const { data: totalSupply, isLoading: isSupplyLoading } = useReadContract({
        ...tokenContract,
        functionName: 'totalSupply',
    });

    const { data: votingPower, isLoading: isVotesLoading } = useReadContract({
        ...tokenContract,
        functionName: 'getVotes',
        args: [userAddress!],
        query: { enabled: !!userAddress },
    });

    // Helper function to format large numbers with commas for readability
    const formatNumberWithCommas = (numStr: string) => {
        // Remove decimals before formatting for whole numbers
        const wholeNumber = numStr.split('.')[0];
        return new Intl.NumberFormat('en-US').format(BigInt(wholeNumber));
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Treasury Balance"
                unit="ETH"
                value={
                    isTreasuryLoading ? <SkeletonLoader /> :
                        (treasuryBalance ? parseFloat(formatEther(treasuryBalance.value)).toFixed(2) : '0.00')
                }
            />
            <StatCard
                title="Total Token Supply"
                unit="RTC"
                value={
                    isSupplyLoading ? <SkeletonLoader /> :
                        (typeof totalSupply === 'bigint' ? formatNumberWithCommas(formatEther(totalSupply)) : '0')
                }
            />
            <StatCard
                title="Your Voting Power"
                unit={userAddress ? "Votes" : ""}
                value={
                    !userAddress ? <span className="text-2xl text-gray-500">Connect Wallet</span> :
                        isVotesLoading ? <SkeletonLoader /> :
                            (typeof votingPower === 'bigint' ? formatNumberWithCommas(formatEther(votingPower)) : '0')
                }
            />
        </div>
    );
}