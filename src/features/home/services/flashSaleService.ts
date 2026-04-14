
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

export async function getActiveFlashSale(): Promise<any> {
    const res = await fetch(`${BACKEND_URL}/flash-sales/active`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch active flash sale");
    }

    const json = await res.json();
    return json.success ? json.data : null;
}
