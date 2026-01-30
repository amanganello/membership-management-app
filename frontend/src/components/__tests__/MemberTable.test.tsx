import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemberTable } from '../MemberTable';
import type { Member } from '@memberapp/shared';

const mockMembers: Member[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        joinDate: '2026-01-01',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        joinDate: '2026-01-15',
        createdAt: '2026-01-15T00:00:00.000Z',
        updatedAt: '2026-01-15T00:00:00.000Z',
    },
];

describe('MemberTable', () => {
    it('should render loading state', () => {
        render(
            <MemberTable members={[]} isLoading={true} onRowClick={() => { }} />
        );

        expect(screen.getByText(/loading members/i)).toBeInTheDocument();
    });

    it('should render empty state when no members', () => {
        render(
            <MemberTable members={[]} isLoading={false} onRowClick={() => { }} />
        );

        expect(screen.getByText(/no members found/i)).toBeInTheDocument();
    });

    it('should render members list', () => {
        render(
            <MemberTable members={mockMembers} isLoading={false} onRowClick={() => { }} />
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should call onRowClick when row is clicked', async () => {
        const user = userEvent.setup();
        const onRowClick = vi.fn();

        render(
            <MemberTable members={mockMembers} isLoading={false} onRowClick={onRowClick} />
        );

        await user.click(screen.getByText('John Doe'));

        expect(onRowClick).toHaveBeenCalledTimes(1);
        expect(onRowClick).toHaveBeenCalledWith(mockMembers[0]);
    });
});
