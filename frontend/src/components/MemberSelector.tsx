import { useState } from 'react';
import { useMembers } from '@/hooks/useMembers';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchInput } from '@/components/SearchInput';
import type { Member } from '@memberapp/shared';

interface MemberSelectorProps {
    onSelect: (member: Member) => void;
    placeholder?: string;
    label?: string;
}

export function MemberSelector({
    onSelect,
    placeholder = 'Search by name or email...',
    label = 'Search Member'
}: MemberSelectorProps) {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const { data: members = [], isLoading } = useMembers(debouncedSearch);

    const handleSelect = (member: Member) => {
        onSelect(member);
        setSearch('');
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (members.length === 1) handleSelect(members[0]);
            }}
            role="search"
        >
            <SearchInput
                id="searchInput"
                name="searchInput"
                label={label}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                aria-autocomplete="list"
            />

            {search.length > 0 && (
                <ul
                    className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto bg-white shadow-sm"
                    role="listbox"
                    aria-label="Search results"
                >
                    {isLoading ? (
                        <li className="p-4 text-center text-gray-500">Searching...</li>
                    ) : members.length === 0 ? (
                        <li className="p-4 text-center text-gray-500">No members found</li>
                    ) : (
                        members.map((member) => (
                            <li key={member.id} role="option">
                                <button
                                    type="button"
                                    onClick={() => handleSelect(member)}
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors cursor-pointer"
                                >
                                    <p className="font-medium text-gray-900">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </form>
    );
}
