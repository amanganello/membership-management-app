import { useState } from 'react';
import { useMembers } from '../hooks/useMembers';
import { MemberTable } from '../components/MemberTable';
import { AddMemberModal } from '../components/AddMemberModal';
import { MemberSummaryModal } from '../components/MemberSummaryModal';
import type { Member } from '@memberapp/shared';

export function MembersPage() {
    const [search, setSearch] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

    const { data: members = [], isLoading } = useMembers(search);

    const handleRowClick = (member: Member) => {
        setSelectedMemberId(member.id);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Members</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Add Member
                </button>
            </div>

            <div className="mt-6">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="mt-6">
                <MemberTable
                    members={members}
                    isLoading={isLoading}
                    onRowClick={handleRowClick}
                />
            </div>

            {/* Add Member Modal */}
            <AddMemberModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {/* Member Summary Modal */}
            <MemberSummaryModal
                memberId={selectedMemberId}
                onClose={() => setSelectedMemberId(null)}
            />
        </div>
    );
}
