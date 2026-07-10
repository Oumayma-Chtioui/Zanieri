"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, subtotal, updateQuantity, removeItem } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={() => setIsOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-ivory shadow-soft flex flex-col">
        <div className="flex items-center justify-between px-6 h-20 border-b border-ink-100">
          <h2 className="font-display italic text-xl">Votre panier</h2>
          <button
            aria-label="Fermer le panier"
            onClick={() => setIsOpen(false)}
            className="p-2"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display italic text-lg text-ink-400 mb-2">
                Votre panier est vide
              </p>
              <p className="text-sm text-ink-400 mb-6">
                Parcourez la collection pour commencer.
              </p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="inline-block px-6 py-3 bg-ink text-ivory text-[12px] uppercase tracking-widest2"
              >
                Voir la boutique
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((line) => (
                <li
                  key={`${line.id}-${line.size || "u"}`}
                  className="flex gap-4"
                >
                  <div className="relative h-24 w-20 flex-none bg-bone/60 border border-ink-100">
                    {line.imageUrl ? (
                      <Image
                        src={line.imageUrl}
                        alt={line.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-display italic text-ink-300 text-xs">
                        Zanieri
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[15px] leading-snug pr-2">
                      {line.name}
                    </p>
                    {line.size && (
                      <p className="text-[12px] text-ink-400 mt-0.5">
                        Taille {line.size}
                      </p>
                    )}
                    <p className="font-mono text-[13px] text-bronze-dark mt-1">
                      {formatPrice(line.price)}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-ink-200">
                        <button
                          className="p-1.5"
                          aria-label="Diminuer la quantité"
                          onClick={() =>
                            updateQuantity(line.id, line.size, line.quantity - 1)
                          }
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-mono">
                          {line.quantity}
                        </span>
                        <button
                          className="p-1.5"
                          aria-label="Augmenter la quantité"
                          onClick={() =>
                            updateQuantity(line.id, line.size, line.quantity + 1)
                          }
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        aria-label="Retirer l'article"
                        className="p-1.5 text-ink-400 hover:text-bronze-dark"
                        onClick={() => removeItem(line.id, line.size)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink-100 px-6 py-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-[12px] uppercase tracking-widest2 text-ink-500">
                Sous-total
              </span>
              <span className="font-display text-xl">
                {formatPrice(subtotal)}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-3.5 bg-ink text-ivory text-[12px] uppercase tracking-widest2 hover:bg-ink-700 transition-colors"
            >
              Finaliser la commande
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
