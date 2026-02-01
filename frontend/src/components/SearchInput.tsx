import { useId, type InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
    /** Label text for the input */
    label?: string;
    /** Additional class names to apply to the input */
    className?: string;
    /** Hide the label visually but keep it for screen readers */
    hideLabel?: boolean;
}

export function SearchInput({
    label,
    className = '',
    hideLabel = false,
    id: providedId,
    ...props
}: SearchInputProps) {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
        <div>
            {label && (
                <label
                    htmlFor={id}
                    className={hideLabel
                        ? 'sr-only'
                        : 'block text-sm font-medium text-gray-700 mb-2'
                    }
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type="text"
                maxLength={255}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
                {...props}
            />
        </div>
    );
}
