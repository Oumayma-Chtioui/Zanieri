"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice, isOnPromotion } from "@/lib/utils";
import { useCart } from "../cart/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const onPromo = isOnPromotion(product);
  const hasSizes = product.sizes && product.sizes.length > 0;

  return (
    <div className="garment-tag group flex flex-col">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-bone/60 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display italic text-ink-300 text-lg">
                Zanieri
              </span>
            </div>
          )}

          {(product.badge || onPromo) && (
            <span className="absolute top-3 right-3 bg-ink text-ivory text-[10px] uppercase tracking-widest2 px-2 py-1">
              {onPromo ? "Promo" : product.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="flex-1 flex flex-col px-4 pt-4 pb-5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-[15px] leading-snug hover:text-bronze-dark transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.fabric && (
          <p className="text-[12px] text-ink-400 mt-1">{product.fabric}</p>
        )}

        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < Math.round(product.rating)
                  ? "fill-bronze text-bronze"
                  : "text-ink-200"
              }
            />
          ))}
          {product.reviewsCount > 0 && (
            <span className="text-[11px] text-ink-400 ml-1">
              ({product.reviewsCount})
            </span>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-[14px] text-ink">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="font-mono text-[12px] text-ink-300 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="mt-4">
          {hasSizes ? (
            <Link
              href={`/product/${product.slug}`}
              className="block text-center py-2.5 border border-ink-200 text-[11px] uppercase tracking-widest2 hover:border-ink transition-colors"
            >
              Choisir la taille
            </Link>
          ) : (
            <button
              onClick={() => addItem(product, { quantity: 1 })}
              className="w-full text-center py-2.5 bg-ink text-ivory text-[11px] uppercase tracking-widest2 hover:bg-ink-700 transition-colors"
            >
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
