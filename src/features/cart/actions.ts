"use server";


import { createSessionFromCart } from "@server/checkout";

/**
 * Buat checkout session dari cart items.
 * 
 * PENTING: Fungsi ini HANYA membuat session, BUKAN order di database.
 * Order dibuat nanti di halaman checkout saat user klik "Bayar Sekarang"
 * setelah memilih alamat dan kurir yang valid.
 * 
 * Ini mencegah "Zombie Orders" — order pending tanpa alamat yang
 * menumpuk di database dari user yang tidak jadi bayar.
 */
export async function createOrderAndCheckoutSession(
    userId: string,
    cartItemsJson: string
) {
    try {
        // Buat checkout session (menyimpan item untuk halaman checkout)
        const sessionId = await createSessionFromCart(userId, cartItemsJson);

        return {
            success: true,
            sessionId,
            // orderId tidak ada — order dibuat nanti di halaman checkout
        };
    } catch (error: unknown) {
        console.error("Error in createOrderAndCheckoutSession:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
