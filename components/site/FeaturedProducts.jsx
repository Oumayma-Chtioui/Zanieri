import Link from "next/link";
import ProductGrid from "./ProductGrid";

export default function FeaturedProducts({ products = [] }) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <span className="text-[11px] uppercase tracking-widest2 text-bronze-dark">
            Sélection de l'atelier
          </span>
          <h2 className="font-display italic text-2xl sm:text-3xl mt-1">
            Pièces à l'honneur
          </h2>
        </div>
        <Link
          href="/products"
          className="stitch-underline text-[12px] uppercase tracking-widest2 text-ink-500 pb-1 hidden sm:block"
        >
          Tout voir
        </Link>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
