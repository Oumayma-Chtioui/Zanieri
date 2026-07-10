import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone } from "lucide-react";

export default function Footer({ settings, categories = [] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <Image
            src="/logo.png"
            alt={settings?.storeName || "Zanieri"}
            width={140}
            height={60}
            className="h-11 w-auto object-contain mb-4 invert"
          />
          <p className="text-ink-200 text-sm leading-relaxed max-w-xs">
            Prêt-à-porter et pièces sur-mesure pour l'homme tunisien. Chaque
            commande est confirmée personnellement, par message.
          </p>
        </div>

        <div>
          <h3 className="font-display italic text-lg mb-4">La Collection</h3>
          <ul className="space-y-2.5 text-sm text-ink-200">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/products?categorie=${cat.id}`}
                  className="hover:text-ivory transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display italic text-lg mb-4">Nous joindre</h3>
          <ul className="space-y-3 text-sm text-ink-200">
            {settings?.address && (
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 flex-none text-bronze-light" />
                <span>{settings.address}</span>
              </li>
            )}
            {settings?.phone && (
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 flex-none text-bronze-light" />
                <span>{settings.phone}</span>
              </li>
            )}
            {settings?.openingHours && (
              <li className="text-ink-300 text-[13px] pl-6">
                {settings.openingHours}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-display italic text-lg mb-4">Suivez la Maison</h3>
          <div className="flex gap-3">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-10 w-10 flex items-center justify-center border border-ink-600 hover:border-bronze-light transition-colors"
              >
                <Instagram size={17} strokeWidth={1.5} />
              </a>
            )}
            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-10 w-10 flex items-center justify-center border border-ink-600 hover:border-bronze-light transition-colors"
              >
                <Facebook size={17} strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-ink-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-[11px] tracking-widest2 uppercase text-ink-400">
          <span>© {year} {settings?.storeName || "Zanieri"}</span>
          <span>Conçu et cousu en Tunisie</span>
        </div>
      </div>
    </footer>
  );
}
