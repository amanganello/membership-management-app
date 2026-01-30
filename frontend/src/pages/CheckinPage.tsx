import { useState } from 'react';
import { useMembers } from '../hooks/useMembers';
import { useCreateCheckin } from '../hooks/useCheckins';
import type { Member } from '@memberapp/shared';

export function CheckinPage() {
    const [searchEmail, setSearchEmail] = useState('');
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { data: members = [] } = useMembers();
    const createCheckin = useCreateCheckin();

    // Find member by email (case-insensitive)
    const handleSearch = () => {
        setMessage(null);
        const found = members.find(
            (m) => m.email.toLowerCase() === searchEmail.toLowerCase().trim()
        );
        if (found) {
            setSelectedMember(found);
        } else {
            setSelectedMember(null);
            setMessage({ type: 'error', text: 'Member not found with that email' });
        }
    };

    const handleCheckin = async () => {
        if (!selectedMember) return;

        try {
            await createCheckin.mutateAsync({ memberId: selectedMember.id });
            setMessage({ type: 'success', text: `✅ ${selectedMember.name} checked in successfully!` });
            setSearchEmail('');
            setSelectedMember(null);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err instanceof Error ? err.message : 'Failed to check in. Member may not have an active membership.',
            });
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Check-in</h1>
            <p className="mt-2 text-gray-600">Record member check-ins</p>

            <div className="mt-8 max-w-md">
                <div className="bg-white rounded-lg shadow p-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Member Email
                    </label>
                    <div className="mt-2 flex gap-2">
                        <input
                            type="email"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Enter member email..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Find
                        </button>
                    </div>

                    {/* Selected Member */}
                    {selectedMember && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="font-medium text-gray-900">{selectedMember.name}</p>
                            <p className="text-sm text-gray-600">{selectedMember.email}</p>
                            <button
                                onClick={handleCheckin}
                                disabled={createCheckin.isPending}
                                className="mt-4 w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {createCheckin.isPending ? 'Checking in...' : '✅ Check In'}
                            </button>
                        </div>
                    )}

                    {/* Message */}
                    {message && (
                        <div
                            className={`mt-4 p-4 rounded-lg ${message.type === 'success'
                                    ? 'bg-green-50 text-green-800'
                                    : 'bg-red-50 text-red-800'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
