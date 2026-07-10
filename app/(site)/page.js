import { getCategories } from "@/lib/categories";
import { getFeaturedProducts } from "@/lib/products";
import { getStoreSettings } from "@/lib/settings";
import { getStores } from "@/lib/stores";
import { getApprovedReviews } from "@/lib/reviews";

import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import CategoryStrip from "@/components/site/CategoryStrip";
import FeaturedProducts from "@/components/site/FeaturedProducts";
import PersonalShopperBanner from "@/components/site/PersonalShopperBanner";
import ReviewsSection from "@/components/site/ReviewsSection";
import StoreLocations from "@/components/site/StoreLocations";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured, settings, stores, reviews] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getStoreSettings(),
    getStores(),
    getApprovedReviews(6),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <TrustBar settings={settings} />
      <CategoryStrip categories={categories} />
      <FeaturedProducts products={featured} />
      <PersonalShopperBanner settings={settings} />
      <ReviewsSection reviews={reviews} />
      <StoreLocations stores={stores} />
    </>
  );
}
