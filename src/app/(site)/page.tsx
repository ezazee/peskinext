import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getProducts } from "@features/product/services/productService";
import { getBanners } from "@features/home/services/bannerService";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic"; // Ensure fresh data on every request

export default async function HomePage() {
  const queryClient = new QueryClient();

  // Prefetch data on Server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["products"],
      queryFn: getProducts,
    }),
    queryClient.prefetchQuery({
      queryKey: ["banners"],
      queryFn: getBanners,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
}
