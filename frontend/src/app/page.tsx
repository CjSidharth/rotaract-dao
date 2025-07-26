'use client';

import { Navbar } from '@/components/Navbar';
import { DAOStats } from '@/components/DAOStats';
import { ProposalList } from '@/components/ProposalList';
import Link from 'next/link';
import { DelegateVotes } from '@/components/DelegateVotes';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950">
      <Navbar />
      
      {/* Header Section with Rotaract Wheel Logo */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              {/* Rotaract Wheel Logo */}
              
              <div>
                <h1 className="text-5xl font-extrabold text-white tracking-tight">
                  Rotaract<span className="text-blue-900">DAO</span>
                </h1>
                <p className="mt-3 text-xl text-blue-900 font-medium">
                  Service Above Self • Fellowship Through Service
                </p>
                <p className="mt-2 text-lg text-blue-800/80">
                  Empowering young leaders to create positive change through decentralized governance
                </p>
              </div>
            </div>

            {/* Action Buttons without Golden Shadow Effects */}
            <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0 flex flex-col sm:flex-row gap-4">
              <DelegateVotes />
              <Link href="/create-proposal">
                <button className="group relative inline-flex items-center px-8 py-4 border-2 border-transparent text-base font-semibold rounded-xl text-white bg-blue-900 hover:bg-blue-950 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-300">
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
  Create Proposal
</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* DAO Stats Section with Golden Accents */}
        <div className="mb-12 mt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600">
              DAO Statistics
            </h2>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mx-auto"></div>
          </div>
          <DAOStats />
        </div>

        {/* Proposals Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-blue-900/20 rounded-3xl"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600">
                Community Proposals
              </h2>
              <div className="mt-2 h-1 w-32 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-300 text-lg">
                Shape the future of our community through collaborative decision-making
              </p>
            </div>
            <ProposalList />
          </div>
        </div>

        {/* Footer Section with Rotaract Values */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Leadership", icon: "👑", desc: "Develop and empower future leaders" },
              { title: "Service", icon: "🤝", desc: "Create positive impact in communities" },
              { title: "Fellowship", icon: "🌟", desc: "Build lasting friendships and networks" },
              { title: "Innovation", icon: "💡", desc: "Pioneer new solutions for old problems" }
            ].map((value, i) => (
              <div key={i} className="group bg-gradient-to-br from-amber-100/10 to-yellow-100/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-300/20 hover:border-amber-400/40 transition-all duration-300">
                <div className="text-4xl mb-3 transition-transform duration-300 hover:scale-110">{value.icon}</div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">{value.title}</h3>
                <p className="text-gray-300 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-amber-500/30 pt-8">
            <p className="text-amber-400 font-semibold text-lg">
              "Service Above Self" 
            </p>
            <p className="text-gray-400 mt-2">
              Powered by Rotaract
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}