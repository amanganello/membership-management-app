import type { Member } from '@memberapp/shared';
import { formatDate } from '@/lib/utils';

interface MemberTableProps {
    members: Member[];
    isLoading: boolean;
    onRowClick: (member: Member) => void;
}

export function MemberTable({ members, isLoading, onRowClick }: MemberTableProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-pulse text-gray-500">Loading members...</div>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No members found
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
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
    );
}
