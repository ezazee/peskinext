// API Primitive Types
// Generic types for API responses

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * API error response
 */
export interface ApiError {
    code: string;
    message: string;
    details?: unknown;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
}

/**
 * Search result wrapper
 */
export interface SearchResult<T> {
    items: T[];
    total: number;
}
