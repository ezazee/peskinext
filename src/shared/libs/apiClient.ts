/**
 * Centralized API Client with Authentication
 * 
 * Provides secure, consistent API communication with:
 * - Automatic authentication token injection
 * - Global error handling
 * - Request/response interceptors
 * - Type-safe responses
 */

import { config } from '@shared/config';
import { createLogger } from './logger';

const logger = createLogger('ApiClient');

/** API Error with status code and details */
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public data?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/** Generic API response wrapper */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/** Request options */
interface RequestOptions extends RequestInit {
    /** Skip auth token injection */
    skipAuth?: boolean;
    /** Custom base URL (overrides config) */
    baseUrl?: string;
}

/**
 * Get authentication token from storage
 * 
 * Priority:
 * 1. HttpOnly cookie (preferred, set by server)
 * 2. SessionStorage (fallback)
 * 3. LocalStorage (last resort)
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        // Try sessionStorage first (more secure than localStorage)
        const sessionToken = sessionStorage.getItem('auth_token');
        if (sessionToken) return sessionToken;

        // Fallback to localStorage
        const localToken = localStorage.getItem('auth_token');
        if (localToken) return localToken;

        return null;
    } catch (error) {
        logger.warn('Failed to get auth token:', error);
        return null;
    }
}

/**
 * Get user ID from storage
 */
function getUserId(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        return sessionStorage.getItem('current_user_id');
    } catch {
        return null;
    }
}

/**
 * Build full request URL
 */
function buildUrl(endpoint: string, baseUrl?: string): string {
    const base = baseUrl || config.apiUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Remove duplicate /api/v1 if present
    const cleanPath = path.replace(/^\/api\/v1/, '');

    return `${base}${cleanPath}`;
}

/**
 * Prepare request headers
 */
function prepareHeaders(options: RequestOptions): HeadersInit {
    const headers = new Headers(options.headers);

    // Add Content-Type if not set
    if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
    }

    // Add auth token if available and not skipped
    if (!options.skipAuth) {
        const token = getAuthToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        // Also add user ID header if available
        const userId = getUserId();
        if (userId) {
            headers.set('X-User-ID', userId);
        }
    }

    return headers;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    // Parse response body
    let data: unknown;
    try {
        data = isJson ? await response.json() : await response.text();
    } catch (error) {
        logger.error('Failed to parse response:', error);
        throw new ApiError(
            response.status,
            'Failed to parse server response',
            null
        );
    }

    // Handle error responses
    if (!response.ok) {
        const errorMessage =
            (data as ApiResponse)?.message ||
            (data as ApiResponse)?.error ||
            `Request failed with status ${response.status}`;

        logger.error('API Error:', {
            status: response.status,
            url: response.url,
            message: errorMessage,
            data,
        });

        throw new ApiError(response.status, errorMessage, data);
    }

    return data as T;
}

/**
 * Main API request function
 * 
 * @example
 * ```ts
 * // GET request
 * const products = await apiClient.get<Product[]>('/products');
 * 
 * // POST request
 * const result = await apiClient.post('/orders', { 
 *   items: [...] 
 * });
 * ```
 */
async function request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const url = buildUrl(endpoint, options.baseUrl);
    const headers = prepareHeaders(options);


    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        return await handleResponse<T>(response);
    } catch (error) {
        // Re-throw ApiError as-is
        if (error instanceof ApiError) {
            throw error;
        }

        // Log as warning rather than error to avoid annoying dev overlays for transient network blinks
        logger.warn('Network error:', error);
        throw new ApiError(
            0,
            error instanceof Error ? error.message : 'Network request failed',
            null
        );
    }
}

/**
 * Centralized API Client
 * 
 * Provides type-safe, authenticated API access with automatic error handling.
 * 
 * @example
 * ```ts
 * import { apiClient } from '@shared/libs/apiClient';
 * 
 * // GET request
 * const products = await apiClient.get<Product[]>('/products');
 * 
 * // POST request
 * const order = await apiClient.post<Order>('/orders', {
 *   items: [...],
 *   addressId: '123'
 * });
 * 
 * // PUT request
 * const updated = await apiClient.put<Order>(`/orders/${id}`, data);
 * 
 * // DELETE request
 * await apiClient.delete(`/orders/${id}`);
 * ```
 */
export const apiClient = {
    /**
     * GET request
     */
    get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    /**
     * POST request
     */
    post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        }),

    /**
     * PUT request
     */
    put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        }),

    /**
     * PATCH request
     */
    patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        }),

    /**
     * DELETE request
     */
    delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),

    /**
     * Raw request (for custom scenarios)
     */
    request,
};

export default apiClient;
