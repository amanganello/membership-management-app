import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (import.meta.env.DEV) {
            console.error('Uncaught error:', error, errorInfo);
        }
        /**
         * PRODUCTION LOGGING STRATEGY:
         * In a production environment, this error should be sent to an observability platform
         * (e.g., Sentry, Datadog, LogRocket) to enable proactive monitoring.
         * 
         * The log entry should include:
         * 1. The Error Stack Trace (for debugging).
         * 2. The Component Stack (from errorInfo) to identify the crash location.
         * 3. User Metadata (ID, Role) for impact analysis (ensure PII is sanitized).
         * 4. Application State context (if available).
         */
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
                        <p className="text-gray-600 mb-4">
                            We're sorry, but an unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            Refresh Page
                        </button>
                        {import.meta.env.DEV && this.state.error && (
                            <pre className="mt-4 p-4 bg-gray-100 rounded text-left text-xs overflow-auto text-red-800">
                                {this.state.error.toString()}
                            </pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
