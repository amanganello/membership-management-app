import { useCreateMember } from '@/hooks/useMembers';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    const createMember = useCreateMember();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const target = e.target as typeof e.target & {
            nameInput: HTMLInputElement;
            emailInput: HTMLInputElement;
        };

        const name = target.nameInput.value.trim();
        const email = target.emailInput.value.trim();

        if (!name || !email) {
            return;
        }

        try {
            await createMember.mutateAsync({ name, email });
            (e.target as HTMLFormElement).reset();
            onClose();
        } catch {
            // Error is displayed via the mutation state
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />

                <div
                    className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-4 lg:p-6"
                    role="dialog"
                    aria-labelledby="modal-title"
                >
                    <h2 id="modal-title" className="text-xl font-semibold text-gray-900 mb-4">
                        Add New Member
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    id="nameInput"
                                    name="nameInput"
                                    type="text"
                                    required
                                    maxLength={255}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    id="emailInput"
                                    name="emailInput"
                                    type="email"
                                    required
                                    maxLength={255}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="john@example.com"
                                />
                            </div>

                            {createMember.isError && (
                                <div role="alert" className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                    {createMember.error instanceof Error && createMember.error.message.includes('Email already exists')
                                        ? 'Account registration could not be completed. Please contact support or try another email.'
                                        : (createMember.error instanceof Error ? createMember.error.message : 'Failed to create member')}
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
