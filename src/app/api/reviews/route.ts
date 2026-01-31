import {
  getReviewsByKey,
  type ReviewsResponse,
} from "@features/product/review/server/reviewService";
import { NextResponse } from "next/server";
function withCache<T extends object>(
  payload: T,
  status = 200
): NextResponse<T> {
  const res = NextResponse.json<T>(payload, { status });
  res.headers.set(
    "Cache-Control",
    "public, max-age=300, s-maxage=300, stale-while-revalidate=600"
  );
  return res;
}

export async function GET(
  req: Request
): Promise<NextResponse<ReviewsResponse>> {
  const { searchParams } = new URL(req.url);
  const sku = searchParams.get("sku");
  const slug = searchParams.get("slug");
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(
    50,
    Math.max(1, Number(searchParams.get("pageSize") ?? 10))
  );

  if (!sku && !slug) {
    return withCache<ReviewsResponse>(
      { items: [], total: 0, average: 0, count: 0, page, pageSize },
      400
    );
  }

  const result = await getReviewsByKey({ sku, slug, page, pageSize });
  return withCache<ReviewsResponse>(result);
}
