import { useState } from 'react';
import { useCreateMember } from '@/hooks/useMembers';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const createMember = useCreateMember();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !email.trim()) {
            setError('Name and email are required');
            return;
        }

        try {
            await createMember.mutateAsync({ name: name.trim(), email: email.trim() });
            setName('');
            setEmail('');
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create member');
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Member</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="john@example.com"
                                />
                            </div>

                            {error && (
                                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMember.isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {createMember.isPending ? 'Creating...' : 'Create Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
