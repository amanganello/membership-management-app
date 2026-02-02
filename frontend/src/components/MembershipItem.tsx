import type { MembershipWithPlan } from '@memberapp/shared';
import { formatDate, getMembershipStatus } from '@/lib/utils';
import { MEMBERSHIP_STATUS_TEXT } from '@/lib/constants';

interface MembershipItemProps {
    membership: MembershipWithPlan;
    onCancel: (membershipId: string) => void;
    isCanceling: boolean;
}

export function MembershipItem({ membership, onCancel, isCanceling }: MembershipItemProps) {
    const status = getMembershipStatus(membership);
    const { isCancelled, isEndsToday, isActive, isFuture } = status;
    const shouldShowCancel = (isActive || isFuture) && !isEndsToday && !isCancelled;

    return (
        <div className="bg-white border rounded-md p-3 shadow-sm">
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                    {isCancelled ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            {MEMBERSHIP_STATUS_TEXT.SCHEDULED_TO_CANCEL}
                        </span>
                    ) : isEndsToday ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            {MEMBERSHIP_STATUS_TEXT.ENDS_TODAY}
                        </span>
                    ) : isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            {MEMBERSHIP_STATUS_TEXT.ACTIVE}
                        </span>
                    ) : isFuture ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Future
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Expired
                        </span>
                    )}
                    <span className="font-medium text-gray-900">{membership.planName}</span>
                </div>
                {shouldShowCancel && (
                    <button
                        onClick={() => onCancel(membership.id)}
                        disabled={isCanceling}
                        className="text-xs text-red-600 hover:text-red-700 underline cursor-pointer disabled:opacity-50"
                    >
                        {isCanceling ? 'Canceling...' : 'Cancel'}
                    </button>
                )}
            </div>
            <p className="text-sm text-gray-500">
                {formatDate(membership.startDate)} → {formatDate(membership.endDate)}
            </p>
            {isCancelled && (
                <p className="text-xs text-yellow-700 mt-1">
                    Cancelled on {formatDate(membership.cancelledAt!)}
                </p>
            )}
        </div>
    );
}
