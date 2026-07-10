"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function ProductsFilterBar({ categories = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("categorie") || "";
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("tri") || "recent";
  const promoOnly = searchParams.get("promo") === "1";

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleCategory(id) {
    updateParam("categorie", activeCategory === id ? "" : id);
  }

  return (
    <div className="mb-10 space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
          />
          <input
            type="text"
            defaultValue={query}
            placeholder="Rechercher une pièce..."
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParam("q", e.currentTarget.value);
            }}
            onBlur={(e) => updateParam("q", e.currentTarget.value)}
            className="w-full border border-ink-200 pl-9 pr-3 py-2.5 text-sm bg-ivory focus:border-ink outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-[12px] uppercase tracking-widest2 text-ink-500 cursor-pointer">
            <input
              type="checkbox"
              checked={promoOnly}
              onChange={(e) => updateParam("promo", e.target.checked ? "1" : "")}
              className="accent-bronze"
            />
            Promotions
          </label>

          <select
            value={sort}
            onChange={(e) => updateParam("tri", e.target.value)}
            className="border border-ink-200 px-3 py-2.5 text-[12px] uppercase tracking-widest2 bg-ivory outline-none"
          >
            <option value="recent">Nouveautés</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Meilleures notes</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => toggleCategory("")}
          data-active={activeCategory === "" ? "true" : "false"}
          className="swatch-chip flex-none px-4 py-2 text-[12px] uppercase tracking-widest2"
        >
          Tout
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            data-active={activeCategory === cat.id ? "true" : "false"}
            className="swatch-chip flex-none px-4 py-2 text-[12px] uppercase tracking-widest2"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
