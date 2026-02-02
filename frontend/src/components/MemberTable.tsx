import type { Member } from '@memberapp/shared';
import { formatDate } from '@/lib/utils';
import { UI_TEXT } from '@/lib/constants';

interface MemberTableProps {
    members: Member[];
    isLoading: boolean;
    onRowClick: (member: Member) => void;
}

export function MemberTable({ members, isLoading, onRowClick }: MemberTableProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-pulse text-gray-500">{UI_TEXT.LOADING_MEMBERS}</div>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                {UI_TEXT.NO_MEMBERS_FOUND}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {UI_TEXT.NAME_HEADER}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {UI_TEXT.EMAIL_HEADER}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {UI_TEXT.JOINED_HEADER}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((member) => (
                            <tr
                                key={member.id}
                                onClick={() => onRowClick(member)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{member.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(member.joinDate)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="block sm:hidden divide-y divide-gray-200">
                {members.map((member) => (
                    <div
                        key={member.id}
                        onClick={() => onRowClick(member)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="text-base font-semibold text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded uppercase">
                                {formatDate(member.joinDate)}
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 truncate">{member.email}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
