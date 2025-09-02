import "server-only";
import type { Review } from "@shared/types/types";
import { reviewsData } from "@data/review";

export type Aggregate = { average: number; count: number };

export type ReviewsResponse = {
  items: Review[];
  total: number;
  average: number;
  count: number;
  page: number;
  pageSize: number;
};

type ReviewMaybeLinked = Review &
  Partial<{ productSku: string; productSlug: string }>;

function matchesKey(
  r: ReviewMaybeLinked,
  sku?: string | null,
  slug?: string | null
): boolean {
  if (sku && r.productSku) return r.productSku === sku;
  if (slug && r.productSlug) return r.productSlug === slug;
  return false;
}

function pickList(
  source: ReadonlyArray<ReviewMaybeLinked>,
  sku?: string | null,
  slug?: string | null
): ReviewMaybeLinked[] {
  let list = source.filter((r) => matchesKey(r, sku, slug));
  if (list.length === 0 && slug)
    list = source.filter((r) => matchesKey(r, null, slug));
  return list;
}

export function getAggregateByKey({
  sku,
  slug,
}: {
  sku?: string | null;
  slug?: string | null;
}): Aggregate {
  if (!sku && !slug) return { average: 0, count: 0 };
  const arr: ReadonlyArray<ReviewMaybeLinked> = Array.isArray(reviewsData)
    ? (reviewsData as ReadonlyArray<ReviewMaybeLinked>)
    : [];
  const list = pickList(arr, sku, slug);
  if (list.length === 0) return { average: 0, count: 0 };

  const sum = list.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  const average = Number((sum / list.length).toFixed(2));
  return { average, count: list.length };
}

export function getReviewsByKey({
  sku,
  slug,
  page = 1,
  pageSize = 10,
}: {
  sku?: string | null;
  slug?: string | null;
  page?: number;
  pageSize?: number;
}): ReviewsResponse {
  if (page < 1) page = 1;
  if (pageSize < 1) pageSize = 1;
  if (pageSize > 50) pageSize = 50;

  const arr: ReadonlyArray<ReviewMaybeLinked> = Array.isArray(reviewsData)
    ? (reviewsData as ReadonlyArray<ReviewMaybeLinked>)
    : [];

  const matched = pickList(arr, sku ?? null, slug ?? null);
  const total = matched.length;

  const start = (page - 1) * pageSize;
  const items = matched.slice(start, start + pageSize) as Review[];

  const sum = matched.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  const average = total ? Number((sum / total).toFixed(2)) : 0;

  return { items, total, average, count: total, page, pageSize };
}
