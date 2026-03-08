interface ChevronDownProps {
    className?: string;
}

export function ChevronDown({ className }: ChevronDownProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden
        >
            <path d="M19 9l-7 7-7-7" />
        </svg>
    );
}
