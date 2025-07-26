// src/components/DAOStats.tsx - THE CORRECTED VERSION
'use client';

import { useBalance, useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { tokenContract, treasuryContract } from '@/lib/contractConfig';

export function DAOStats() {
    const { address: userAddress } = useAccount();

    // Destructure isLoading and isError for robust UI handling
    const { 
        data: treasuryBalance, 
        isLoading: isTreasuryLoading, 
        isError: isTreasuryError 
    } = useBalance({
        address: treasuryContract.address,
    });

    const { 
        data: totalSupply, 
        isLoading: isSupplyLoading, 
        isError: isSupplyError 
    } = useReadContract({
        ...tokenContract,
        functionName: 'totalSupply',
    });

    const { 
        data: votingPower, 
        isLoading: isVotesLoading, 
        isError: isVotesError 
    } = useReadContract({
        ...tokenContract,
        functionName: 'getVotes',
        args: [userAddress!],
        // The query will not run until userAddress is available
        query: { enabled: !!userAddress },
    });

    // Helper function to render the treasury balance
    const renderTreasuryBalance = () => {
        if (isTreasuryLoading) return 'Loading...';
        // useBalance returns undefined on error, so this check is sufficient
        if (isTreasuryError || !treasuryBalance) return '0 ETH';
        return `${formatEther(treasuryBalance.value)} ETH`;
    };

    // Helper function to render the total supply
    const renderTotalSupply = () => {
        if (isSupplyLoading) return 'Loading...';
        if (isSupplyError) return 'Error fetching supply';
        // THIS IS THE KEY FIX: Explicitly check the type before formatting.
        // This handles undefined, null, {}, and any other non-bigint value.
        if (typeof totalSupply === 'bigint') {
            return `${formatEther(totalSupply)} RTC`;
        }
        return '0'; // Fallback for all other cases
    };

    // Helper function to render the user's voting power
    const renderVotingPower = () => {
        if (!userAddress) return 'Connect wallet';
        if (isVotesLoading) return 'Loading...';
        if (isVotesError) return 'Error fetching votes';
        // Use the same robust type check here
        if (typeof votingPower === 'bigint') {
            return `${formatEther(votingPower)} Votes`;
        }
        return '0'; // Fallback
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-bold text-gray-700">Treasury Balance</h3>
                <p className="text-2xl">{renderTreasuryBalance()}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-bold text-gray-700">Total Token Supply</h3>
                <p className="text-2xl">{renderTotalSupply()}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-bold text-gray-700">Your Voting Power</h3>
                <p className="text-2xl">{renderVotingPower()}</p>
            </div>
        </div>
    );
}