import { NextResponse } from "next/server";
import type { Review } from "@shared/types/types";
import { reviewsData } from "@data/review";

type Aggregate = { average: number; count: number };

// Review lokal boleh belum linked → opsional
type ReviewMaybeLinked = Review & Partial<{ productSku: string; productSlug: string }>;

function matchesKey(r: ReviewMaybeLinked, sku?: string | null, slug?: string | null) {
  // cocok bila data punya sku/slug yang sama
  if (sku && r.productSku) return r.productSku === sku;
  if (slug && r.productSlug) return r.productSlug === slug;
  return false;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sku = searchParams.get("sku");
  const slug = searchParams.get("slug");

  if (!sku && !slug) {
    return NextResponse.json<Aggregate>({ average: 0, count: 0 }, { status: 400 });
  }

  const arr: ReadonlyArray<ReviewMaybeLinked> = Array.isArray(reviewsData)
    ? (reviewsData as ReadonlyArray<ReviewMaybeLinked>)
    : [];

  // kiriman bisa berisi dua-duanya → filter match dg salah satu
  let list = arr.filter((r) => matchesKey(r, sku, slug));

  // fallback ekstra: jika ada sku tapi tidak ada satu pun yang punya productSku,
  // dan slug tersedia, coba paksa pakai slug saja
  if (list.length === 0 && slug) {
    list = arr.filter((r) => matchesKey(r, null, slug));
  }

  if (list.length === 0) {
    return NextResponse.json<Aggregate>({ average: 0, count: 0 });
  }

  const sum = list.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  const average = Number((sum / list.length).toFixed(2));

  return NextResponse.json<Aggregate>({ average, count: list.length });
}
