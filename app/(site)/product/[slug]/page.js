import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  isOnPromotion,
} from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import ProductActions from "@/components/site/ProductActions";
import ProductGrid from "@/components/site/ProductGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description?.slice(0, 155),
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product, 4);
  const onPromo = isOnPromotion(product);
  const gallery = [product.imageUrl, ...product.gallery].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-bone/60 border border-ink-100 overflow-hidden">
            {gallery[0] ? (
              <Image
                src={gallery[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display italic text-ink-300 text-xl">
                  Zanieri
                </span>
              </div>
            )}
            {(product.badge || onPromo) && (
              <span className="absolute top-4 right-4 bg-ink text-ivory text-[10px] uppercase tracking-widest2 px-2.5 py-1.5">
                {onPromo ? "Promo" : product.badge}
              </span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(1).map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-bone/60 border border-ink-100 overflow-hidden"
                >
                  <Image src={src} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-bronze-dark mb-3">
            {product.category}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(product.rating)
                    ? "fill-bronze text-bronze"
                    : "text-ink-200"
                }
              />
            ))}
            {product.reviewsCount > 0 && (
              <span className="text-[12px] text-ink-400 ml-1">
                ({product.reviewsCount} avis)
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-mono text-2xl text-ink">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="font-mono text-base text-ink-300 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-ink-500 text-[15px] leading-relaxed mt-6">
              {product.description}
            </p>
          )}

          <dl className="grid grid-cols-2 gap-4 mt-6 mb-8 text-[13px]">
            {product.fabric && (
              <div>
                <dt className="text-ink-400 uppercase tracking-widest2 text-[11px] mb-1">
                  Matière
                </dt>
                <dd>{product.fabric}</dd>
              </div>
            )}
            {product.fit && (
              <div>
                <dt className="text-ink-400 uppercase tracking-widest2 text-[11px] mb-1">
                  Coupe
                </dt>
                <dd>{product.fit}</dd>
              </div>
            )}
          </dl>

          <div className="stitch-divider mb-8" />

          <ProductActions product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display italic text-2xl mb-8">
            Complète le vestiaire
          </h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
