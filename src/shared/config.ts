/**
 * Centralized Configuration Service
 * 
 * Single source of truth for all environment variables and app configuration.
 * Provides type-safe access to configuration values.
 */

interface AppConfig {
    /** Backend API base URL */
    apiUrl: string;
    /** Current environment */
    env: 'development' | 'production' | 'test';
    /** Is development mode */
    isDev: boolean;
    /** Is production mode */
    isProd: boolean;
    /** Application name */
    appName: string;
    /** Application version */
    version: string;
}

/**
 * Validate required environment variables on app startup
 */
function validateConfig(): void {
    const required = ['NEXT_PUBLIC_API_URL'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            `Please check your .env file.`
        );
    }
}

// Validate on import (fails fast if config is invalid)
if (typeof window === 'undefined') {
    validateConfig();
}

/**
 * Application configuration object
 * 
 * Usage:
 * ```ts
 * import { config } from '@shared/config';
 * 
 * const response = await fetch(`${config.apiUrl}/products`);
 * ```
 */
export const config: AppConfig = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1',
    env: (process.env.NODE_ENV as AppConfig['env']) || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
    appName: 'PE Skin Pro',
    version: '1.0.0',
};

/**
 * Get full API endpoint URL
 * 
 * @param path - API path (with or without leading slash)
 * @returns Full URL
 * 
 * @example
 * getApiUrl('/products') // => 'http://127.0.0.1:5000/api/v1/products'
 * getApiUrl('products')  // => 'http://127.0.0.1:5000/api/v1/products'
 */
export function getApiUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${config.apiUrl}${cleanPath}`;
}

export default config;
