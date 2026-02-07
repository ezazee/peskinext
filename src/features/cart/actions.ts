"use server";


import { createSessionFromCart } from "@server/checkout";
import type { CartItem } from "@shared/types/types";

export async function createOrderAndCheckoutSession(
    userId: string,
    cartItemsJson: string
) {
    try {
        // 1. Create checkout session first
        const sessionId = await createSessionFromCart(userId, cartItemsJson);

        // 2. Parse cart items to create order
        const cartItems = JSON.parse(cartItemsJson) as CartItem[];
        const selectedItems = cartItems.filter((item) => item.selected);

        if (selectedItems.length === 0) {
            throw new Error("No items selected");
        }

        // 3. Prepare order payload
        const items = selectedItems.map((item) => {
            const product = item.product;
            const variants = product.variants;
            const variant = variants.find((v) => v.id === item.variantId);

            return {
                product_id: product.id,
                variant_id: item.variantId,
                quantity: item.qty,
                price: Number(variant?.price) || 0
            };
        });

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // 4. Create order in backend
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                address_id: "temp",
                items,
                total_amount: total,
                shipping_cost: 0,
                discount: 0,
                courier: "temp"
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Failed to create order:", error);
            throw new Error("Failed to create order");
        }

        const orderData = await response.json();
        console.log("✅ Order created:", orderData.id);

        // 5. Store orderId in session
        // We'll need to update the session with the orderId
        // For now, return both sessionId and orderId

        return {
            success: true,
            sessionId,
            orderId: orderData.id
        };
    } catch (error: unknown) {
        console.error("Error in createOrderAndCheckoutSession:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
