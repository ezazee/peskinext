
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface CreatePaymentResponse {
    success: boolean;
    payment_url: string;
    invoice_number: string;
    message?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPayment = async (orderId: string): Promise<any> => {
    try {
        const res = await fetch(`${API_URL}/payment/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ order_id: orderId }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Gagal membuat pembayaran");
        }

        return data;
    } catch (error: unknown) {
        console.error("Payment Service Error:", error);
        const msg = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            payment_url: "",
            invoice_number: "",
            message: msg
        };
    }
}
