// src/app/create-proposal/page.tsx
import { Navbar } from '@/components/Navbar';
import { CreateProposalForm } from '@/components/CreateProposalForm'; // <-- This should now work

export default function CreateProposalPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">Create a New Proposal</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Propose a transfer of funds from the DAO Treasury for a community initiative.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                    <CreateProposalForm />
                </div>
            </main>
        </div>
    );
}
