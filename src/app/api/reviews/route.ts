import { NextResponse } from "next/server";
import type { Review } from "@shared/types/types";
import { reviewsData } from "@data/review";

type ReviewMaybeLinked = Review & Partial<{ productSku: string; productSlug: string }>;

type ReviewsResponse = {
  items: Review[];
  total: number;
  average: number;
  count: number;
  page: number;
  pageSize: number;
};

function matchesKey(r: ReviewMaybeLinked, sku?: string | null, slug?: string | null) {
  if (sku && r.productSku) return r.productSku === sku;
  if (slug && r.productSlug) return r.productSlug === slug;
  return false;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sku = searchParams.get("sku");
  const slug = searchParams.get("slug");
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 10)));

  if (!sku && !slug) {
    return NextResponse.json<ReviewsResponse>(
      { items: [], total: 0, average: 0, count: 0, page, pageSize },
      { status: 400 }
    );
  }

  const arr: ReadonlyArray<ReviewMaybeLinked> = Array.isArray(reviewsData)
    ? (reviewsData as ReadonlyArray<ReviewMaybeLinked>)
    : [];

  // match dg sku/slug (atau keduanya)
  let list = arr.filter((r) => matchesKey(r, sku, slug));
  if (list.length === 0 && slug) {
    list = arr.filter((r) => matchesKey(r, null, slug));
  }

  const total = list.length;
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize) as Review[];

  const sum = list.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  const average = total ? Number((sum / total).toFixed(2)) : 0;

  return NextResponse.json<ReviewsResponse>({
    items,
    total,
    average,
    count: total,
    page,
    pageSize,
  });
}
