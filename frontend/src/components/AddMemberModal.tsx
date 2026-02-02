import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMember } from '@/hooks/useMembers';
import { createMemberSchema, type CreateMemberInput } from '@/lib/utils';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    const createMember = useCreateMember();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<CreateMemberInput>({
        resolver: zodResolver(createMemberSchema),
        defaultValues: {
            name: '',
            email: ''
        }
    });

    if (!isOpen) return null;

    const onSubmit = async (data: CreateMemberInput) => {
        try {
            await createMember.mutateAsync(data);
            reset();
            onClose();
        } catch {
            // Error is displayed via the mutation state
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={handleClose}
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

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    id="nameInput"
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="John Doe"
                                    {...register('name')}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                {/* Changed type="email" to type="text" to enable custom validation fully via Zod */}
                                <input
                                    id="emailInput"
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="john@example.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
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
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || createMember.isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting || createMember.isPending ? 'Creating...' : 'Create Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
