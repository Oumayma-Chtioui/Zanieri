"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../cart/CartContext";

export default function ProductActions({ product }) {
  const { addItem, setIsOpen } = useCart();
  const router = useRouter();
  const hasSizes = product.sizes && product.sizes.length > 0;
  const [size, setSize] = useState(hasSizes ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    addItem(product, { size, quantity });
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="space-y-6">
      {hasSizes && (
        <div>
          <p className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-2.5">
            Taille
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                data-active={size === s ? "true" : "false"}
                className="swatch-chip px-4 py-2 text-[13px] font-mono"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-2.5">
          Quantité
        </p>
        <div className="flex items-center border border-ink-200 w-fit">
          <button
            className="p-3"
            aria-label="Diminuer la quantité"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center font-mono text-sm">{quantity}</span>
          <button
            className="p-3"
            aria-label="Augmenter la quantité"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {outOfStock ? (
        <p className="text-[13px] text-ink-400 italic">
          Actuellement indisponible — contactez-nous pour un délai de réassort.
        </p>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full py-4 bg-ink text-ivory text-[12px] uppercase tracking-widest2 hover:bg-ink-700 transition-colors"
        >
          Ajouter au panier
        </button>
      )}

      <button
        onClick={() => {
          if (!outOfStock) handleAdd();
          router.push("/cart");
        }}
        disabled={outOfStock}
        className="w-full py-4 border border-ink text-ink text-[12px] uppercase tracking-widest2 hover:bg-ink hover:text-ivory transition-colors disabled:opacity-40"
      >
        Commander directement
      </button>
    </div>
  );
}
