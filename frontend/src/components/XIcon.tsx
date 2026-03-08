interface XIconProps {
    className?: string;
}

export function XIcon({ className }: XIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden
        >
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    );
}
