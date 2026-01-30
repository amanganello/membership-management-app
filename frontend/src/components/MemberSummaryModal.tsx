import { useState } from 'react';
import { useMemberSummary } from '../hooks/useMemberSummary';
import { usePlans } from '../hooks/usePlans';
import { useAssignMembership, useCancelMembership } from '../hooks/useMemberships';

interface MemberSummaryModalProps {
    memberId: string | null;
    onClose: () => void;
}

export function MemberSummaryModal({ memberId, onClose }: MemberSummaryModalProps) {
    const { data: member, isLoading, error } = useMemberSummary(memberId);
    const { data: plans } = usePlans();
    const assignMembership = useAssignMembership();
    const cancelMembership = useCancelMembership();

    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showAssignForm, setShowAssignForm] = useState(false);

    if (!memberId) return null;

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlanId || !startDate || !endDate) return;

        try {
            await assignMembership.mutateAsync({
                memberId,
                planId: selectedPlanId,
                startDate,
                endDate,
            });
            setShowAssignForm(false);
            setSelectedPlanId('');
            setStartDate('');
            setEndDate('');
        } catch {
            // Error handled by React Query
        }
    };

    const handleCancel = async () => {
        if (!member?.activeMembership) return;
        const today = new Date().toISOString().split('T')[0];

        try {
            await cancelMembership.mutateAsync({
                id: member.activeMembership.id,
                data: { cancelDate: today },
            });
        } catch {
            // Error handled by React Query
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={onClose} />

                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>

                    {isLoading && <div className="text-center py-8">Loading...</div>}

                    {error && (
                        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                            Failed to load member
                        </div>
                    )}

                    {member && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
                                <p className="text-gray-500">{member.email}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Joined: {new Date(member.joinDate).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Membership Status */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">Membership Status</h3>
                                {member.activeMembership ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                            <span className="font-medium">{member.activeMembership.planName}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {member.activeMembership.startDate} → {member.activeMembership.endDate}
                                        </p>
                                        <button
                                            onClick={handleCancel}
                                            disabled={cancelMembership.isPending}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            {cancelMembership.isPending ? 'Canceling...' : 'Cancel Membership'}
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            No active membership
                                        </span>
                                        <button
                                            onClick={() => setShowAssignForm(!showAssignForm)}
                                            className="block mt-2 text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            + Assign Membership
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Assign Form */}
                            {showAssignForm && !member.activeMembership && (
                                <form onSubmit={handleAssign} className="bg-blue-50 rounded-lg p-4 space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                                        <select
                                            value={selectedPlanId}
                                            onChange={(e) => setSelectedPlanId(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="">Select a plan</option>
                                            {plans?.map((plan) => (
                                                <option key={plan.id} value={plan.id}>
                                                    {plan.name} - ${plan.monthlyCost}/mo
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={assignMembership.isPending}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {assignMembership.isPending ? 'Assigning...' : 'Assign Membership'}
                                    </button>
                                </form>
                            )}

                            {/* Check-in Stats */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">Check-in Activity</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{member.checkinCount30Days}</p>
                                        <p className="text-sm text-gray-500">Last 30 days</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900">
                                            {member.lastCheckinAt
                                                ? new Date(member.lastCheckinAt).toLocaleString()
                                                : 'Never'}
                                        </p>
                                        <p className="text-sm text-gray-500">Last check-in</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
