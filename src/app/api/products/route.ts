import { NextResponse } from "next/server";
import { getProducts } from "@features/product/services/productService";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
