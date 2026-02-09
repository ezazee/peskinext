const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export interface NotificationItem {
    id: number;
    user_id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    category: "transaction" | "promo" | "system";
    is_read: boolean;
    active: boolean;
    date: string;
    actionUrl?: string;
    created_at: string;
}

export interface NotificationResponse {
    success: boolean;
    data: NotificationItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const getNotifications = async (page = 1, limit = 10) => {
    const res = await fetch(`${API_URL}/notifications?page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: 'include', // Send cookies automatically
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
};

export const getUnreadCount = async () => {
    const res = await fetch(`${API_URL}/notifications/unread`, {
        method: "GET",
        credentials: 'include', // Send cookies automatically
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        console.error("Failed to fetch unread count");
        return { count: 0 };
    }
    const json = await res.json();
    return json.data;
};

export const markAsRead = async (id: number) => {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        credentials: 'include', // Send cookies automatically
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error("Failed to mark as read");
    return res.json();
};

export const markAllAsRead = async () => {
    const res = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PUT",
        credentials: 'include', // Send cookies automatically
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error("Failed to mark all as read");
    return res.json();
};
