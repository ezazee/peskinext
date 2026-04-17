'use client';

import { useState, useCallback } from 'react';
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

                // Log error
                console.error('[AsyncHandler Error]', {
                    error,
                    args,
                    handler: handler.name || 'anonymous'
                });

                // Error toast
                const errorMsg = options?.errorMessage || 'Terjadi kesalahan. Silakan coba lagi.';
                toast.error(errorMsg);

                // Error callback
                if (options?.onError) {
                    options.onError(error);
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
