import { useState, useEffect } from 'react';
import { MemberSelector } from '@/components/MemberSelector';
import { useCreateCheckin } from '@/hooks/useCheckins';
import type { Member } from '@memberapp/shared';

export function CheckinPage() {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const createCheckin = useCreateCheckin();

    // Auto-dismiss success messages
    useEffect(() => {
        if (message?.type === 'success') {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSelectMember = (member: Member) => {
        setSelectedMember(member);
        setMessage(null);
    };

    const handleCheckin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!selectedMember) return;

        try {
            await createCheckin.mutateAsync({ memberId: selectedMember.id });
            setMessage({ type: 'success', text: `✅ ${selectedMember.name} checked in successfully!` });
            setSelectedMember(null);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err instanceof Error ? err.message : 'Failed to check in. Member may not have an active membership.',
            });
        }
    };

    const handleClearSelection = () => {
        setSelectedMember(null);
        setMessage(null);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Check-in</h1>
            <p className="mt-2 text-gray-600">Record member check-ins</p>

            <div className="mt-8 max-w-md">
                <div className="bg-white rounded-lg shadow p-6">
                    {!selectedMember && (
                        <MemberSelector onSelect={handleSelectMember} />
                    )}

                    {selectedMember && (
                        <form onSubmit={handleCheckin}>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-900">{selectedMember.name}</p>
                                        <p className="text-sm text-gray-600">{selectedMember.email}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleClearSelection}
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                        aria-label="Clear selection"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={createCheckin.isPending}
                                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 cursor-pointer"
                                >
                                    {createCheckin.isPending ? 'Checking in...' : '✅ Check In'}
                                </button>
                            </div>
                        </form>
                    )}

                    {message && (
                        <div
                            role="alert"
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
