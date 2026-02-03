import { useState, useEffect } from 'react';
import { useMemberSummary } from '@/hooks/useMemberSummary';
import { usePlans } from '@/hooks/usePlans';
import { useAssignMembership, useCancelMembership } from '@/hooks/useMemberships';
import { formatDate, formatDateTime, calculateMinStartDate, getLocalDateString } from '@/lib/utils';
import { UI_TEXT } from '@/lib/constants';
import { MembershipItem } from './MembershipItem';

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

    useEffect(() => {
        if (!memberId) {
            // setSelectedPlanId('');
            // setStartDate('');
            setShowAssignForm(false);
        }
    }, [memberId]);

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


    const handleCancelMembership = async (membershipId: string) => {

        try {
            await cancelMembership.mutateAsync({
                id: membershipId,
                data: { cancelDate: getLocalDateString() },
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
            // find the latest end date from memberships
            const latestMembership = member?.memberships?.reduce((latest, current) => {
                return current.endDate > latest.endDate ? current : latest;
            }, member.memberships[0]);

            const minDate = calculateMinStartDate(latestMembership?.endDate);
            setStartDate(minDate);
        }
    };

    // Calculate generic min start date based on any active/future plans
    const latestEndDate = member?.memberships && member.memberships.length > 0
        ? member.memberships.reduce((max, m) => m.endDate > max ? m.endDate : max, member.memberships[0].endDate)
        : undefined;
    const minStartDate = calculateMinStartDate(latestEndDate);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={onClose} />

                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-4 lg:p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
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
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-gray-900">{UI_TEXT.MEMBERSHIP_STATUS_HEADER}</h3>
                                    {!showAssignForm && (
                                        <button
                                            onClick={handleToggleAssignForm}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                                        >
                                            {UI_TEXT.ASSIGN_MEMBERSHIP_ACTION}
                                        </button>
                                    )}
                                </div>

                                {member.memberships && member.memberships.length > 0 ? (
                                    <div className="space-y-3">
                                        {member.memberships.map((membership) => (
                                            <MembershipItem
                                                key={membership.id}
                                                membership={membership}
                                                onCancel={handleCancelMembership}
                                                isCanceling={cancelMembership.isPending}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-white rounded border border-dashed text-gray-500 text-sm">
                                        {UI_TEXT.NO_ACTIVE_MEMBERSHIP}
                                    </div>
                                )}
                            </div>

                            {showAssignForm && (
                                <form onSubmit={handleAssign} className="relative bg-blue-50 rounded-lg p-4 space-y-3">
                                    <button
                                        type="button"
                                        onClick={handleToggleAssignForm}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        aria-label="Close"
                                    >
                                        <span className="text-lg">✕</span>
                                    </button>
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
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                    >
                                        {assignMembership.isPending ? 'Adding...' : 'Add Membership'}
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
