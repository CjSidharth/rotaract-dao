// src/app/page.tsx
import { Navbar } from '@/components/Navbar';
import { DAOStats } from '@/components/DAOStats';
import { ProposalList } from '@/components/ProposalList';
import Link from 'next/link';
import { DelegateVotes } from '@/components/DelegateVotes'; // We'll add this for completeness

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              DAO Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Welcome to the RotaractDAO. Propose, vote, and build the future together.
            </p>
          </div>

          {/* Call to Action Button */}
          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0 flex gap-x-4">
            {/* Add the Delegate Votes button here for easy access */}
            <DelegateVotes />

            <Link href="/create-proposal">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create Proposal
              </button>
            </Link>
          </div>
        </div>

        {/* DAO Stats Section */}
        <div className="mb-8">
          <DAOStats />
        </div>

        {/* Proposals List Section */}
        <div>
          <ProposalList />
        </div>

      </main>
    </div>
  );
}
