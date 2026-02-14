/**
 * Error Boundary Component with Sentry Integration
 * 
 * Catches React errors and reports to Sentry for production monitoring.
 * Provides user-friendly error UI instead of blank screen.
 */

'use client';

import React, { Component } from 'react';
import type { ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
    children: ReactNode;
    /** Fallback UI to show when error occurs */
    fallback?: (error: Error, errorInfo: React.ErrorInfo) => ReactNode;
    /** Additional context for error reporting */
    context?: Record<string, unknown>;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary with Sentry Integration
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 * 
 * With custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={(error) => <div>Error: {error.message}</div>}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log to Sentry
        Sentry.withScope((scope) => {
            // Add context from props
            if (this.props.context) {
                scope.setContext('component_context', this.props.context);
            }

            // Add component stack
            scope.setContext('react_error_info', {
                componentStack: errorInfo.componentStack,
            });

            // Capture exception
            Sentry.captureException(error);
        });

        // Update state with error info
        this.setState({
            errorInfo,
        });

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error Boundary caught an error:', error, errorInfo);
        }
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError && this.state.error) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.state.errorInfo!);
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center">
                            {/* Error Icon */}
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
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

                            {/* Error Message */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Oops! Terjadi Kesalahan
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Kami telah mencatat error ini dan akan segera memperbaikinya.
                            </p>

                            {/* Error Details (Development Only) */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                                    <p className="text-xs font-mono text-gray-800 break-all">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={this.handleReset}
                                    className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    Coba Lagi
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Kembali ke Beranda
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
