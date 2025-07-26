'use client';

import { useBalance, useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { tokenContract, treasuryContract } from '@/lib/contractConfig';

const StatCard = ({ title, value, unit, icon }: { title: string, value: string | React.ReactNode, unit?: string, icon?: string }) => {
    return (
        <div className="relative bg-gradient-to-br from-amber-50/10 to-yellow-100/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-300/30 hover:border-amber-400/50 transition-all duration-500">
            <div className="relative p-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest">
                        {title}
                    </h3>
                    {icon && (
                        <span className="text-2xl transition-transform duration-300 hover:scale-110">
                            {icon}
                        </span>
                    )}
                </div>
                
                <div className="flex items-baseline space-x-2">
                    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white">
                        {value}
                    </div>
                    {unit && (
                        <span className="text-lg font-semibold text-amber-300/80 hover:text-amber-300 transition-colors duration-300">
                            {unit}
                        </span>
                    )}
                </div>
                
                <div className="mt-4 h-1 w-0 hover:w-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-700"></div>
            </div>
        </div>
    );
};

const SkeletonLoader = () => (
    <div className="h-10 bg-gradient-to-r from-amber-200/20 via-yellow-200/30 to-amber-200/20 rounded-lg animate-pulse w-3/4 mt-2">
        <div className="h-full bg-gradient-to-r from-transparent via-amber-300/10 to-transparent animate-pulse"></div>
    </div>
);

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

    const formatNumberWithCommas = (numStr: string) => {
        const wholeNumber = numStr.split('.')[0];
        return new Intl.NumberFormat('en-US').format(BigInt(wholeNumber));
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
                title="Treasury Balance"
                unit="ETH"
                icon=""
                value={
                    isTreasuryLoading ? <SkeletonLoader /> :
                        (treasuryBalance ? parseFloat(formatEther(treasuryBalance.value)).toFixed(2) : '0.00')
                }
            />
            <StatCard
                title="Total Token Supply"
                unit="RTC"
                icon=""
                value={
                    isSupplyLoading ? <SkeletonLoader /> :
                        (typeof totalSupply === 'bigint' ? formatNumberWithCommas(formatEther(totalSupply)) : '0')
                }
            />
            <StatCard
                title="Your Voting Power"
                unit={userAddress ? "Votes" : ""}
                icon=""
                value={
                    !userAddress ? (
                        <span className="text-xl text-amber-300/70 font-medium">
                            Connect Wallet
                        </span>
                    ) :
                        isVotesLoading ? <SkeletonLoader /> :
                            (typeof votingPower === 'bigint' ? formatNumberWithCommas(formatEther(votingPower)) : '0')
                }
            />
        </div>
    );
}