import { NextResponse } from "next/server";
import { getProductBySlug } from "@features/product/services/productService";

export async function GET(
    request: Request,
    props: { params: Promise<{ slug: string }> }
) {
    const params = await props.params;
    const { slug } = params;
    try {
        const product = await getProductBySlug(slug);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}
