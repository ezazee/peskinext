// UI Common Prop Patterns
// Reusable prop patterns for components

import type { ReactNode } from 'react';

/**
 * Components that accept children
 */
export interface WithChildren {
    children: ReactNode;
}

/**
 * Components that accept className
 */
export interface WithClassName {
    className?: string;
}

/**
 * Combined children + className (most common)
 */
export type BaseProps = WithChildren & WithClassName;

/**
 * Generic loading state
 */
export interface LoadingState {
    isLoading: boolean;
}

/**
 * Generic error state
 */
export interface ErrorState {
    error: Error | null;
}

/**
 * Async data wrapper
 */
export type AsyncData<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };
