// src/components/CreateProposalForm.tsx
'use client';

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { encodeFunctionData, parseEther, isAddress } from 'viem';
import { governorContract, treasuryContract } from '@/lib/contractConfig';

// A simple toast notification component for feedback
// For a real app, you'd use a library like react-hot-toast
const Toast = ({ message, type }: { message: string | null, type: 'success' | 'error' }) => {
    if (!message) return null;
    const colors = type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700';
    return (
        <div className={`p-4 mt-4 border rounded-md ${colors}`} role="alert">
            <p className="font-bold">{type === 'success' ? 'Success' : 'Error'}</p>
            <p>{message}</p>
        </div>
    );
};

export function CreateProposalForm() {
    // Form state
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    // wagmi hook for writing to the contract
    const { writeContract, isPending, data: hash } = useWriteContract();

    // State for user feedback
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // --- 1. Input Validation ---
        if (!description || !recipient || !amount) {
            setError("All fields are required.");
            return;
        }
        if (!isAddress(recipient)) {
            setError("The recipient is not a valid Ethereum address.");
            return;
        }

        try {
            // --- 2. Encode the Function Call ---
            // This prepares the `calldata` for the `propose` function.
            // We are encoding the Treasury's `transfer` function.
            const calldata = encodeFunctionData({
                abi: treasuryContract.abi,
                functionName: 'transfer',
                args: [
                    recipient as `0x${string}`, // The recipient address from the form
                    parseEther(amount)          // The ETH amount, converted to wei
                ],
            });

            // --- 3. Call the Governor's `propose` function ---
            writeContract({
                ...governorContract,
                functionName: 'propose',
                args: [
                    [treasuryContract.address], // `targets` array: The contract to call
                    [0n],                       // `values` array: No ETH sent with the call itself
                    [calldata],                 // `calldatas` array: The encoded function call
                    description,                // The proposal description
                ],
            }, {
                onSuccess: (hash) => {
                    setSuccess(`Proposal submitted successfully! Transaction hash: ${hash}`);
                    // Reset form
                    setRecipient('');
                    setAmount('');
                    setDescription('');
                },
                onError: (err) => {
                    setError(err.message || "An unknown error occurred.");
                }
            });

        } catch (err: any) {
            console.error("Proposal creation error:", err);
            setError(err.message || "An unexpected error occurred during encoding.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description Input */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Proposal Title / Description
                </label>
                <div className="mt-1">
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="E.g., Fund the Q3 Developer Grants"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            {/* Recipient Address Input */}
            <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                    Recipient Address
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="recipient"
                        id="recipient"
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                </div>
            </div>

            {/* Amount Input */}
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount (ETH)
                </label>
                <div className="mt-1">
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        step="0.01"
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.5"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Submitting Proposal...' : 'Submit Proposal'}
                </button>
            </div>

            {/* Feedback Section */}
            <div className="feedback-section">
                <Toast message={success} type="success" />
                <Toast message={error} type="error" />
            </div>
        </form>
    );
}
