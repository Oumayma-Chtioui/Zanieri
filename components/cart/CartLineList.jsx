"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartLineList() {
  const { items, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="border border-ink-100 px-8 py-16 text-center">
        <p className="font-display italic text-xl text-ink-400 mb-3">
          Votre panier est vide
        </p>
        <Link
          href="/products"
          className="inline-block mt-2 px-7 py-3 bg-ink text-ivory text-[12px] uppercase tracking-widest2"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-ink-100 border border-ink-100">
      {items.map((line) => (
        <li key={`${line.id}-${line.size || "u"}`} className="flex gap-5 p-5">
          <div className="relative h-28 w-24 flex-none bg-bone/60 border border-ink-100">
            {line.imageUrl ? (
              <Image src={line.imageUrl} alt={line.name} fill className="object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-display italic text-ink-300 text-xs">
                Zanieri
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex justify-between gap-4">
              <div>
                <Link href={`/product/${line.slug}`} className="font-display text-[16px] hover:text-bronze-dark">
                  {line.name}
                </Link>
                {line.size && (
                  <p className="text-[12px] text-ink-400 mt-1">Taille {line.size}</p>
                )}
              </div>
              <p className="font-mono text-[14px] flex-none">
                {formatPrice(line.price * line.quantity)}
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4">
              <div className="flex items-center border border-ink-200">
                <button
                  className="p-2"
                  aria-label="Diminuer la quantité"
                  onClick={() => updateQuantity(line.id, line.size, line.quantity - 1)}
                >
                  <Minus size={13} />
                </button>
                <span className="w-9 text-center text-sm font-mono">{line.quantity}</span>
                <button
                  className="p-2"
                  aria-label="Augmenter la quantité"
                  onClick={() => updateQuantity(line.id, line.size, line.quantity + 1)}
                >
                  <Plus size={13} />
                </button>
              </div>
              <button
                aria-label="Retirer l'article"
                className="p-2 text-ink-400 hover:text-bronze-dark"
                onClick={() => removeItem(line.id, line.size)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
