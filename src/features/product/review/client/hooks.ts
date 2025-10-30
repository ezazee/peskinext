"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReviewsResponse, Aggregate } from "../server/reviewService";

export function useReviews(slug: string, page = 1, pageSize = 10) {
  return useQuery<ReviewsResponse>({
    queryKey: ["reviews", slug, page, pageSize],
    queryFn: async () => {
      const url = `/api/reviews?slug=${encodeURIComponent(
        slug
      )}&page=${page}&pageSize=${pageSize}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return (await res.json()) as ReviewsResponse;
    },
    // anti-refetch total
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useReviewSummary(slug: string) {
  return useQuery<Aggregate>({
    queryKey: ["reviews", "summary", slug],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/summary?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error("Failed to fetch review summary");
      return (await res.json()) as Aggregate;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
