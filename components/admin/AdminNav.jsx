"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Shirt,
  Tags,
  Settings,
  MapPin,
  Star,
  UploadCloud,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const LINKS = [
  { href: "/admin", label: "Produits", icon: Shirt },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/import", label: "Import en masse", icon: UploadCloud },
  { href: "/admin/reviews", label: "Avis clients", icon: Star },
  { href: "/admin/stores", label: "Adresses", icon: MapPin },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  return (
    <div className="bg-ink text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Zanieri"
            width={100}
            height={40}
            className="h-8 w-auto object-contain invert"
          />
          <span className="text-[11px] uppercase tracking-widest2 text-ink-300 hidden sm:inline">
            Administration
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[12px] uppercase tracking-widest2 text-ink-300 hover:text-ivory"
        >
          <LogOut size={14} />
          Déconnexion
        </button>
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto no-scrollbar border-t border-ink-700">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-none flex items-center gap-2 px-4 py-3 text-[12px] uppercase tracking-widest2 border-b-2 transition-colors ${
                active
                  ? "border-bronze-light text-ivory"
                  : "border-transparent text-ink-300 hover:text-ivory"
              }`}
            >
              <Icon size={14} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
