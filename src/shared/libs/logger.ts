/**
 * Production-Safe Logger
 * 
 * Automatically disabled in production to prevent:
 * - Performance overhead
 * - Data exposure in browser console
 * - Debug information leakage
 */

import { config } from '@shared/config';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface Logger {
    log: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
}

/**
 * Create a namespaced logger
 * 
 * @param namespace - Logger namespace (e.g., 'CartService', 'CheckoutFlow')
 * @returns Logger instance
 * 
 * @example
 * ```ts
 * const logger = createLogger('CartService');
 * logger.log('Item added to cart', { productId: '123' });
 * // Development: [CartService] Item added to cart { productId: '123' }
 * // Production: (silent)
 * ```
 */
export function createLogger(namespace: string): Logger {
    const prefix = `[${namespace}]`;

    const noop = () => { };

    // In production, only allow error logging
    if (config.isProd) {
        return {
            log: noop,
            info: noop,
            warn: noop,
            error: (...args: unknown[]) => console.error(prefix, ...args),
            debug: noop,
        };
    }

    // In development, allow all logging
    return {
        log: (...args: unknown[]) => console.log(prefix, ...args),
        info: (...args: unknown[]) => console.info(prefix, ...args),
        warn: (...args: unknown[]) => console.warn(prefix, ...args),
        error: (...args: unknown[]) => console.error(prefix, ...args),
        debug: (...args: unknown[]) => console.debug(prefix, ...args),
    };
}

/**
 * Default application logger
 * 
 * Usage:
 * ```ts
 * import { logger } from '@shared/libs/logger';
 * 
 * logger.log('Something happened');
 * logger.error('Error occurred', error);
 * ```
 */
export const logger = createLogger('App');

export default logger;
