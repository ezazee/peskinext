// Notification Entity Types

/**
 * Notification category
 */
export type NotifKind = 'transaksi' | 'update' | 'promo' | 'info' | 'feed';

/**
 * Transaction-related notification status
 */
export type NotifStatus =
    | 'ongoing'
    | 'pending_payment'
    | 'delivered'
    | 'completed'
    | 'cancelled';

/**
 * Notification item
 */
export interface NotificationItem {
    id: string;
    kind: NotifKind;
    status?: NotifStatus;
    title: string;
    message: string;
    date: string;
    badge?: string;
    active?: boolean;
    action?: { label: string; href: string };
}
