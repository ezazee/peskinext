'use client';

import { useState, useCallback } from 'react';
import * as Sentry from '@sentry/nextjs';
import { useToast } from '@shared/components/ui/Toaster';

interface UseAsyncHandlerOptions<T> {
    onSuccess?: (result: T) => void;
    onError?: (error: Error) => void;
    errorMessage?: string;
    successMessage?: string;
}

/**
 * Hook for handling async operations with automatic error handling
 * 
 * Features:
 * - Automatic Sentry error reporting
 * - Loading state management
 * - Toast notifications
 * - Type-safe error handling
 * 
 * Usage:
 * ```tsx
 * const { execute: handleCheckout, loading } = useAsyncHandler(
 *   async () => {
 *     const response = await apiClient.post('/checkout', data);
 *     return response.data;
 *   },
 *   {
 *     onSuccess: (order) => router.push(`/transaction/${order.id}`),
 *     errorMessage: 'Gagal menyelesaikan checkout',
 *   }
 * );
 * 
 * <button onClick={handleCheckout} disabled={loading}>
 *   {loading ? 'Memproses...' : 'Checkout'}
 * </button>
 * ```
 */
export function useAsyncHandler<T extends (...args: unknown[]) => Promise<unknown>>(
    handler: T,
    options?: UseAsyncHandlerOptions<Awaited<ReturnType<T>>>
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const toast = useToast();

    const execute = useCallback(
        async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
            setLoading(true);
            setError(null);

            try {
                const result = await handler(...args);

                // Success callback
                if (options?.onSuccess) {
                    options.onSuccess(result as Awaited<ReturnType<T>>);
                }

                // Success toast
                if (options?.successMessage) {
                    toast.success(options.successMessage);
                }

                return result as Awaited<ReturnType<T>>;
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                setError(error);

                // Report to Sentry
                Sentry.captureException(error, {
                    extra: {
                        args,
                        handlerName: handler.name || 'anonymous',
                    },
                    tags: {
                        errorType: 'async-handler',
                    },
                });

                // Error toast
                const errorMsg = options?.errorMessage || 'Terjadi kesalahan. Silakan coba lagi.';
                toast.error(errorMsg);

                // Error callback
                if (options?.onError) {
                    options.onError(error);
                }

                // Log in development
                if (process.env.NODE_ENV === 'development') {
                    console.error('[useAsyncHandler] Error:', error);
                    console.error('[useAsyncHandler] Args:', args);
                }

                // Don't throw - let component handle via loading/error states
                return undefined;
            } finally {
                setLoading(false);
            }
        },
        [handler, options, toast]
    );

    return {
        execute,
        loading,
        error,
        isError: error !== null,
        reset: () => {
            setError(null);
            setLoading(false);
        },
    };
}

/**
 * Simpler version for fire-and-forget operations
 * 
 * Usage:
 * ```tsx
 * const handleDelete = useAsyncAction(
 *   async (id: string) => {
 *     await apiClient.delete(`/items/${id}`);
 *   },
 *   { successMessage: 'Item dihapus' }
 * );
 * 
 * <button onClick={() => handleDelete('123')}>Hapus</button>
 * ```
 */
export function useAsyncAction<T extends (...args: unknown[]) => Promise<unknown>>(
    action: T,
    options?: UseAsyncHandlerOptions<Awaited<ReturnType<T>>>
) {
    const { execute, loading } = useAsyncHandler(action, options);

    return {
        execute,
        loading,
    };
}
