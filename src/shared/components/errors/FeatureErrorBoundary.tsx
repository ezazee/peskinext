'use client';

import { Component, type ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
    children: ReactNode;
    featureName: string;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Feature-level Error Boundary
 * 
 * Prevents errors in one feature from crashing the entire app.
 * Automatically reports errors to Sentry with feature context.
 * 
 * Usage:
 * ```tsx
 * <FeatureErrorBoundary featureName="Keranjang Belanja">
 *   <CartPageClient />
 * </FeatureErrorBoundary>
 * ```
 */
export class FeatureErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Report to Sentry with feature context
        Sentry.captureException(error, {
            contexts: {
                react: {
                    componentStack: errorInfo.componentStack,
                },
            },
            tags: {
                feature: this.props.featureName,
                errorBoundary: 'feature',
            },
            level: 'error',
        });

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${this.props.featureName}] Error caught by boundary:`, error);
            console.error('Component stack:', errorInfo.componentStack);
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            {/* Error Icon */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>

                            {/* Error Content */}
                            <div className="flex-1">
                                <h3 className="font-bold text-red-900 text-lg mb-2">
                                    Terjadi Kesalahan
                                </h3>
                                <p className="text-sm text-red-700 mb-4">
                                    Maaf, fitur <strong>{this.props.featureName}</strong> mengalami masalah.
                                    Tim kami telah diberitahu dan akan segera memperbaikinya.
                                </p>

                                {/* Development error details */}
                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <div className="mb-4 p-3 bg-red-100 rounded text-xs font-mono text-red-800 overflow-auto max-h-32">
                                        <div className="font-bold mb-1">Development Info:</div>
                                        <div>{this.state.error.message}</div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={this.handleReload}
                                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Muat Ulang
                                    </button>
                                    <button
                                        onClick={this.handleGoHome}
                                        className="px-4 py-2 bg-white border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Kembali ke Beranda
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
