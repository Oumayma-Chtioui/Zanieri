import Image from "next/image";
import Link from "next/link";

export default function Hero({ settings }) {
  const { heroTitle, heroSubtitle, heroImageUrl } = settings;

  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 relative">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-bronze-dark mb-6">
            <span className="tuck-marker" />
            Collection Automne — Hiver
          </span>

          <h1 className="font-display text-[13vw] leading-[0.95] sm:text-6xl lg:text-[4.6rem] text-ink text-balance">
            {heroTitle}
          </h1>

          <p className="mt-6 max-w-md text-ink-500 text-[15px] leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="px-7 py-3.5 bg-ink text-ivory text-[12px] uppercase tracking-widest2 hover:bg-ink-700 transition-colors"
            >
              Découvrir la collection
            </Link>
            <Link
              href="/about"
              className="px-7 py-3.5 border border-ink-300 text-ink text-[12px] uppercase tracking-widest2 hover:border-ink transition-colors"
            >
              La Maison Zanieri
            </Link>
          </div>

          <div className="mt-14 hidden sm:flex items-center gap-6 text-[12px] text-ink-400">
            <span>Étoffes sélectionnées</span>
            <span className="h-1 w-1 rounded-full bg-ink-300" />
            <span>Retouche sur mesure</span>
            <span className="h-1 w-1 rounded-full bg-ink-300" />
            <span>Commande par WhatsApp</span>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] w-full bg-bone/70 border border-ink-100">
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt="Zanieri"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <Image
                  src="/logo.png"
                  alt="Zanieri"
                  width={280}
                  height={120}
                  className="w-full max-w-[240px] object-contain opacity-90"
                />
              </div>
            )}
            <div className="absolute -bottom-4 -left-4 h-full w-full border border-bronze/40 -z-10" />
          </div>
        </div>
      </div>

      <div className="stitch-divider" />
    </section>
  );
}
