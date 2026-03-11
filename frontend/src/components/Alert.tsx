import { cn } from '@/lib/utils';

type AlertVariant = 'error' | 'success';

interface AlertProps {
    variant: AlertVariant;
    message: string;
    className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
    error: 'bg-red-50 text-red-600',
    success: 'bg-green-50 text-green-800',
};

export function Alert({ variant, message, className }: AlertProps) {
    return (
        <div role="alert" className={cn('text-sm p-3 rounded-lg', variantStyles[variant], className)}>
            {message}
        </div>
    );
}
