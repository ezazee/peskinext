import "server-only";
import type { Review } from "@shared/types/types";

export type Aggregate = { average: number; count: number };

export type ReviewsResponse = {
  items: Review[];
  total: number;
  average: number;
  count: number;
  page: number;
  pageSize: number;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

interface BackendReview {
  id: number;
  rating: number;
  comment: string;
  images: string[] | string; // Can be array or JSON string depending on backend version
  created_at: string;
  user?: string | { name: string }; // Backend returns string "Name", old interface expected object
  productSlug?: string;
  variant?: string;
  userImage?: string;
}

export async function getReviewsByKey({
  // sku, // unused
  slug,
  page = 1,
  pageSize = 10,
}: {
  sku?: string | null;
  slug?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<ReviewsResponse> {
  if (page < 1) page = 1;
  const safePageSize = Math.min(50, Math.max(1, pageSize ?? 10));

  if (!slug) {
    return { items: [], total: 0, average: 0, count: 0, page, pageSize: safePageSize };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/reviews?slug=${slug}`);

    if (res.status === 404) {
      return { items: [], total: 0, average: 0, count: 0, page, pageSize: safePageSize };
    }

    if (!res.ok) throw new Error("Failed to fetch reviews");

    // Backend returns all reviews for the product
    const allReviews: BackendReview[] = await res.json();

    const total = allReviews.length;
    const sum = allReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const average = total > 0 ? Number((sum / total).toFixed(2)) : 0;

    // Pagination logic (client-side of the backend data)
    const start = (page - 1) * safePageSize;
    const end = start + safePageSize;
    const pagedBackendReviews = allReviews.slice(start, end);

    const items: Review[] = pagedBackendReviews.map((r) => {
      let images: string[] = [];
      if (Array.isArray(r.images)) {
        images = r.images;
      } else if (typeof r.images === 'string') {
        try {
          images = JSON.parse(r.images || "[]");
        } catch { /* ignore */ }
      }

      // Handle user name whether it's a string or object
      let userName = "Anonymous";
      if (typeof r.user === "string") {
        userName = r.user;
      } else if (r.user && typeof r.user === "object" && 'name' in r.user) {
        userName = r.user.name;
      }

      return {
        id: r.id,
        user: userName,
        variant: r.variant || "General",
        comment: r.comment,
        rating: r.rating,
        images: images,
        date: r.created_at,
        productSlug: slug || "",
        userImage: r.userImage,
      };
    });

    return { items, total, average, count: total, page, pageSize: safePageSize };

  } catch (error) {
    console.error("Review fetch error:", error);
    return { items: [], total: 0, average: 0, count: 0, page, pageSize: safePageSize };
  }
}

export async function getAggregateByKey({
  sku,
  slug,
}: {
  sku?: string | null;
  slug?: string | null;
}): Promise<Aggregate> {
  const data = await getReviewsByKey({ sku, slug, page: 1, pageSize: 1 });
  return { average: data.average, count: data.count };
}
