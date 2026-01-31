import {
  getAggregateByKey,
  type Aggregate,
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

export async function GET(req: Request): Promise<NextResponse<Aggregate>> {
  const { searchParams } = new URL(req.url);
  const sku = searchParams.get("sku");
  const slug = searchParams.get("slug");
  if (!sku && !slug) return withCache<Aggregate>({ average: 0, count: 0 }, 400);
  const agg = await getAggregateByKey({ sku, slug });
  return withCache<Aggregate>(agg);
}
