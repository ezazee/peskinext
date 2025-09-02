export const reviewKeys = {
  list: (slug: string, page: number, pageSize: number) =>
    ["reviews", slug, page, pageSize] as const,
  summary: (slug: string) => ["reviews", "summary", slug] as const,
};
