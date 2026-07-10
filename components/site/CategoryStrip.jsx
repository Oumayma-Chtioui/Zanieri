import Link from "next/link";
import * as Icons from "lucide-react";

export default function CategoryStrip({ categories = [] }) {
  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-display italic text-2xl sm:text-3xl">
          Par catégorie
        </h2>
        <Link
          href="/products"
          className="stitch-underline text-[12px] uppercase tracking-widest2 text-ink-500 pb-1"
        >
          Tout voir
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = Icons[cat.icon] || Icons.Shirt;
          return (
            <Link
              key={cat.id}
              href={`/products?categorie=${cat.id}`}
              className="group flex flex-col items-center gap-3 border border-ink-100 bg-ivory hover:border-bronze/60 px-4 py-7 transition-colors"
            >
              <Icon
                size={26}
                strokeWidth={1.3}
                className="text-ink-500 group-hover:text-bronze-dark transition-colors"
              />
              <span className="text-[12px] uppercase tracking-widest2 text-ink-600 text-center">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
