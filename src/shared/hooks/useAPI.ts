"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type UseAPIOptions<T = unknown> = {
  /** Auto fetch on mount */
  enabled?: boolean;
  /** Refetch interval in ms (0 = disabled) */
  refetchInterval?: number;
  /** Callback on success */
  onSuccess?: (data: T) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
};

export type UseAPIResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

/**
 * Generic API fetching hook with abort controller support
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useAPI<Product[]>(
 *   '/api/products',
 *   { enabled: true }
 * );
 * ```
 */
export function useAPI<T = unknown>(
  url: string | null,
  options: UseAPIOptions<T> = {}
): UseAPIResult<T> {
  const { enabled = true, refetchInterval = 0, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!controller.signal.aborted) {
        setData(result);
        setLoading(false);
        onSuccess?.(result);
      }
    } catch (err: unknown) {
      if (!controller.signal.aborted) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
        onError?.(error);
      }
    }
  }, [url, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    if (enabled && url) {
      fetchData();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [enabled, url, fetchData]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval > 0 && enabled && url) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refetchInterval, enabled, url, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Generic API mutation hook (POST, PUT, DELETE, etc)
 *
 * @example
 * ```tsx
 * const { mutate, loading, error } = useAPIMutation<Response, Body>(
 *   '/api/products',
 *   'POST'
 * );
 *
 * const handleSubmit = async () => {
 *   await mutate({ name: 'Product' });
 * };
 * ```
 */
export function useAPIMutation<TResponse = unknown, TBody = unknown>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (body?: TBody): Promise<TResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setLoading(false);
        return result;
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
        return null;
      }
    },
    [url, method]
  );

  return {
    mutate,
    loading,
    error,
  };
}
