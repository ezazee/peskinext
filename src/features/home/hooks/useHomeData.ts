import { useProducts } from "@features/product/hooks/useProducts";
import { useBanners } from "@features/home/hooks/useBanners";
import { useFlashSale } from "@features/home/hooks/useFlashSale";
import type { Product, Banner } from "@shared/types/types";

type HomeData = {
  products: Product[];
  flashSale: any;
  main: Banner[];
  carousel: Banner[];
  tiles: Banner[];
  popup: Banner[];
  welcome: Banner[];
  promo_mobile: Banner[];
  promo_desktop: Banner[];
  bundle: Banner[];
  gallery_carousel: Banner[];
  gallery_single: Banner[];
};

export function useHomeData() {
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts();
  const { data: bannerData, isLoading: bannersLoading, error: bannersError } = useBanners();
  const { data: flashSale, isLoading: flashSaleLoading, error: flashSaleError } = useFlashSale();

  const loading = productsLoading || bannersLoading || flashSaleLoading;
  const error = productsError || bannersError || flashSaleError;

  const data: HomeData | null = products && bannerData ? {
    products,
    flashSale,
    main: bannerData.main || [],
    carousel: bannerData.carousel || [],
    tiles: bannerData.tiles || [],
    popup: bannerData.popup || [],
    welcome: bannerData.welcome || [],
    promo_mobile: bannerData.promo_mobile || [],
    promo_desktop: bannerData.promo_desktop || [],
    bundle: bannerData.bundle || [],
    gallery_carousel: bannerData.gallery_carousel || [],
    gallery_single: bannerData.gallery_single || [],
  } : null;

  return { data, loading, error: error as Error };
}
