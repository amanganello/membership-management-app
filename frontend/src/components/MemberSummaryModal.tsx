import { useState } from 'react';
import { useMemberSummary } from '@/hooks/useMemberSummary';
import { usePlans } from '@/hooks/usePlans';
import { useAssignMembership, useCancelMembership } from '@/hooks/useMemberships';
import { formatDate, formatDateTime, calculateMinStartDate } from '@/lib/utils';
import { MEMBERSHIP_STATUS_TEXT, UI_TEXT } from '@/lib/constants';

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
    const [showAssignForm, setShowAssignForm] = useState(false);

    if (!memberId) return null;

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlanId || !startDate) return;

        try {
            await assignMembership.mutateAsync({
                memberId,
                planId: selectedPlanId,
                startDate,
            });
            setShowAssignForm(false);
            setSelectedPlanId('');
            setStartDate('');
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

    const handleToggleAssignForm = () => {
        const nextState = !showAssignForm;
        setShowAssignForm(nextState);

        if (nextState) {
            // Auto-fill with the valid minimum date (Today or Next Day after active plan)
            const minDate = calculateMinStartDate(member?.activeMembership?.endDate);
            setStartDate(minDate);
        }
    };

    const minStartDate = calculateMinStartDate(member?.activeMembership?.endDate);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={onClose} />

                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-4 lg:p-6">
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
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
                                <p className="text-gray-500">{member.email}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {UI_TEXT.JOINED_PREFIX} {formatDate(member.joinDate)}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">{UI_TEXT.MEMBERSHIP_STATUS_HEADER}</h3>
                                {member.activeMembership ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {member.activeMembership.cancelledAt ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {MEMBERSHIP_STATUS_TEXT.SCHEDULED_TO_CANCEL}
                                                </span>
                                            ) : new Date(member.activeMembership.endDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    {MEMBERSHIP_STATUS_TEXT.ENDS_TODAY}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {MEMBERSHIP_STATUS_TEXT.ACTIVE}
                                                </span>
                                            )}
                                            <span className="font-medium">{member.activeMembership.planName}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(member.activeMembership.startDate)} → {formatDate(member.activeMembership.endDate)}
                                        </p>

                                        {member.activeMembership.cancelledAt && (
                                            <p className="text-xs text-yellow-700 mt-1">
                                                {UI_TEXT.ACCESS_UNTIL_PREFIX} {formatDate(member.activeMembership.endDate)}
                                            </p>
                                        )}

                                        <div className="flex gap-4 pt-2">
                                            {!member.activeMembership.cancelledAt && new Date(member.activeMembership.endDate).toISOString().split('T')[0] !== new Date().toISOString().split('T')[0] && (
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={cancelMembership.isPending}
                                                    className="text-sm text-red-600 hover:text-red-700"
                                                >
                                                    {cancelMembership.isPending ? UI_TEXT.CANCELING_BUTTON : UI_TEXT.CANCEL_MEMBERSHIP_BUTTON}
                                                </button>
                                            )}
                                            <button
                                                onClick={handleToggleAssignForm}
                                                className="text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                {UI_TEXT.SCHEDULE_RENEWAL_ACTION}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {UI_TEXT.NO_ACTIVE_MEMBERSHIP}
                                        </span>
                                        <button
                                            onClick={handleToggleAssignForm}
                                            className="block mt-2 text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            {UI_TEXT.ASSIGN_MEMBERSHIP_ACTION}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {showAssignForm && (
                                <form onSubmit={handleAssign} className="bg-blue-50 rounded-lg p-4 space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                                        <select
                                            value={selectedPlanId}
                                            onChange={(e) => {
                                                setSelectedPlanId(e.target.value);
                                            }}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            required
                                        >
                                            <option value="">Select a plan</option>
                                            {plans?.map((plan) => (
                                                <option key={plan.id} value={plan.id}>
                                                    {plan.name} - ${plan.monthlyCost}
                                                    {plan.durationUnit !== 'month' ? ` / ${plan.durationValue} ${plan.durationUnit}` : '/mo'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            min={minStartDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            required
                                        />
                                    </div>

                                    {selectedPlanId && startDate && (
                                        <div className="bg-white/50 p-3 rounded text-sm text-gray-600">
                                            {(() => {
                                                const plan = plans?.find(p => p.id === selectedPlanId);
                                                if (!plan) return null;

                                                // Simple client-side preview (backend is source of truth)
                                                // Just showing the duration here is often enough
                                                return (
                                                    <p>
                                                        <span className="font-medium">Duration:</span> {' '}
                                                        {plan.durationValue} {plan.durationUnit}{plan.durationValue > 1 ? 's' : ''}
                                                    </p>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={assignMembership.isPending}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {assignMembership.isPending ? 'Assigning...' : 'Assign Membership'}
                                    </button>
                                </form>
                            )}

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">{UI_TEXT.CHECKIN_ACTIVITY_HEADER}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{member.checkinCount30Days}</p>
                                        <p className="text-sm text-gray-500">{UI_TEXT.LAST_30_DAYS_LABEL}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900">
                                            {member.lastCheckinAt
                                                ? formatDateTime(member.lastCheckinAt)
                                                : UI_TEXT.NEVER_CHECKED_IN}
                                        </p>
                                        <p className="text-sm text-gray-500">{UI_TEXT.LAST_CHECKIN_LABEL}</p>
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
