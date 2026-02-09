"use server";

import { cookies } from "next/headers";
import type { NotificationItem } from "@shared/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Server action to get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<number> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (!sessionToken) {
            return 0;
        }

        const parts = sessionToken.split(":");
        if (parts.length < 3) {
            return 0;
        }

        const accessToken = parts.slice(2).join(":");

        const res = await fetch(`${API_URL}/notifications/unread`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to fetch unread count:", res.status);
            return 0;
        }

        const json = await res.json();
        return json.data?.count || 0;
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0;
    }
}

/**
 * Server action to get notification list
 */
export async function getNotificationsList(page = 1, limit = 50): Promise<NotificationItem[]> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (!sessionToken) {
            return [];
        }

        const parts = sessionToken.split(":");
        if (parts.length < 3) {
            return [];
        }

        const accessToken = parts.slice(2).join(":");

        const res = await fetch(`${API_URL}/notifications?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to fetch notifications:", res.status);
            return [];
        }

        const json = await res.json();
        const notifications = json.data || [];

        // Map API response to match frontend expected format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return notifications.map((notif: any) => {
            let actionHref = notif.actionUrl;
            const actionLabel = "Lihat Detail";

            if (!actionHref) {
                switch (notif.category) {
                    case 'promo':
                        actionHref = '/all-product';
                        break;
                    case 'feed':
                        actionHref = '/blog';
                        break;
                    case 'info':
                        actionHref = '/account/transaction';
                        break;
                    // 'transaction' category usually has specific URL from backend, 
                    // if not we might want to default to transaction list or specific detail if ID is available
                    case 'transaction':
                        // If backend doesn't provide specific URL, default to list
                        // Ideally backend provides /account/transaction/[id]
                        if (!actionHref) actionHref = '/account/transaction';
                        break;
                }
            }

            return {
                ...notif,
                id: String(notif.id),
                kind: notif.category === 'transaction' ? 'transaksi' : notif.category,
                status: notif.metadata?.status, // Extract status from metadata
                date: notif.created_at,
                active: !notif.is_read,
                action: actionHref ? { label: actionLabel, href: actionHref } : undefined,
            };
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}

/**
 * Server action to seed test notifications
 */
export async function seedNotifications() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (!sessionToken) return { success: false };

        const parts = sessionToken.split(":");
        if (parts.length < 3) return { success: false };

        const accessToken = parts.slice(2).join(":");

        const res = await fetch(`${API_URL}/notifications/seed-test`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to seed notifications:", res.status);
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        console.error("Error seeding notifications:", error);
        return { success: false };
    }
}
// End of seedNotifications

/**
 * Server action to mark a single notification as read
 */
export async function markNotificationAsRead(id: string) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (!sessionToken) return { success: false };

        const parts = sessionToken.split(":");
        if (parts.length < 3) return { success: false };

        const accessToken = parts.slice(2).join(":");

        const res = await fetch(`${API_URL}/notifications/${id}/read`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to mark notification as read:", res.status);
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false };
    }
}

/**
 * Server action to mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (!sessionToken) return { success: false };

        const parts = sessionToken.split(":");
        if (parts.length < 3) return { success: false };

        const accessToken = parts.slice(2).join(":");

        const res = await fetch(`${API_URL}/notifications/read-all`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to mark all as read:", res.status);
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        console.error("Error marking all as read:", error);
        return { success: false };
    }
}
