import { getProducts, isOnPromotion } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import ProductsFilterBar from "@/components/site/ProductsFilterBar";
import ProductGrid from "@/components/site/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Boutique",
  description:
    "Costumes, chemises, blazers et accessoires pour homme. Découvrez la collection Zanieri.",
};

export default async function ProductsPage({ searchParams }) {
  const [allProducts, categories, resolvedSearchParams] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams,
  ]);

  const categorie = resolvedSearchParams?.categorie || "";
  const q = (resolvedSearchParams?.q || "").toLowerCase().trim();
  const tri = resolvedSearchParams?.tri || "recent";
  const promoOnly = resolvedSearchParams?.promo === "1";
  
  let products = allProducts;

  if (categorie) {
    products = products.filter((p) => p.category === categorie);
  }
  if (q) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.fabric || "").toLowerCase().includes(q)
    );
  }
  if (promoOnly) {
    products = products.filter((p) => isOnPromotion(p));
  }

  switch (tri) {
    case "price-asc":
      products = [...products].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products = [...products].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      products = [...products].sort((a, b) => b.rating - a.rating);
      break;
    default:
      products = [...products].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="mb-10">
        <span className="text-[11px] uppercase tracking-widest2 text-bronze-dark">
          La boutique
        </span>
        <h1 className="font-display italic text-3xl sm:text-4xl mt-1">
          Toute la collection
        </h1>
      </div>

      <ProductsFilterBar categories={categories} />

      <p className="text-[13px] text-ink-400 mb-6">
        {products.length} pièce{products.length !== 1 ? "s" : ""}
      </p>

      <ProductGrid products={products} />
    </div>
  );
}
