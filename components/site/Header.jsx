"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "../cart/CartContext";

export default function Header({ categories = [], storeName = "Zanieri" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-sm border-b border-ink-100">
      {/* Thin utility strip — quiet, informational, not decorative */}
      <div className="hidden sm:block bg-ink text-ivory text-[11px] tracking-widest2 uppercase">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex justify-between">
          <span>Atelier &amp; boutique — Monastir, Tunisie</span>
          <span>Commande &amp; retrait via WhatsApp</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          <button
            className="lg:hidden p-2 -ml-2 text-ink"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <Link href="/" className="flex items-center gap-3 mx-auto lg:mx-0">
            <Image
              src="/logo.png"
              alt={storeName}
              width={150}
              height={64}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-body text-[13px] uppercase tracking-widest2 text-ink-600">
            <Link href="/products" className="stitch-underline pb-1" data-active="false">
              Toute la boutique
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categorie=${cat.id}`}
                className="stitch-underline pb-1"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/about" className="stitch-underline pb-1">
              La Maison
            </Link>
          </nav>

          <button
            className="relative p-2 text-ink"
            aria-label="Voir le panier"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-4 w-4 rounded-full bg-bronze text-ivory text-[10px] font-mono">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="stitch-divider" />

      {/* Mobile slide-in menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-ivory shadow-soft flex flex-col">
            <div className="flex items-center justify-between px-5 h-20 border-b border-ink-100">
              <span className="font-display italic text-lg">{storeName}</span>
              <button
                aria-label="Fermer le menu"
                onClick={() => setMenuOpen(false)}
                className="p-2"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col px-5 py-6 gap-5 text-[13px] uppercase tracking-widest2 text-ink-600 overflow-y-auto">
              <Link href="/products" onClick={() => setMenuOpen(false)}>
                Toute la boutique
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?categorie=${cat.id}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                La Maison
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
