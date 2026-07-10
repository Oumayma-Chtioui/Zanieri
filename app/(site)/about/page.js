import { getStoreSettings } from "@/lib/settings";
import { getStores } from "@/lib/stores";
import StoreLocations from "@/components/site/StoreLocations";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "La Maison",
  description:
    "L'histoire de Zanieri, maison de prêt-à-porter pour homme basée en Tunisie.",
};

export default async function AboutPage() {
  const [settings, stores] = await Promise.all([
    getStoreSettings(),
    getStores(),
  ]);

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center">
        <span className="text-[11px] uppercase tracking-widest2 text-bronze-dark">
          Depuis l'atelier
        </span>
        <h1 className="font-display italic text-3xl sm:text-5xl mt-3 mb-8 text-balance">
          Une élégance pensée pour l'homme d'aujourd'hui
        </h1>
        <p className="text-ink-500 text-[15px] sm:text-[17px] leading-relaxed">
          {settings.storeName} est née d'une conviction simple : bien
          s'habiller ne devrait jamais être compliqué. Chaque pièce de la
          maison est choisie pour sa matière, ajustée pour sa coupe, et
          pensée pour durer au-delà d'une saison. Du costume de cérémonie à
          la chemise du quotidien, nous confirmons chaque commande
          personnellement — pas d'attente, pas de formulaire sans réponse.
        </p>
      </div>

      <div className="stitch-divider" />

      <div className="max-w-5xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-8 text-center">
        <div>
          <p className="font-display italic text-2xl mb-2">Étoffes</p>
          <p className="text-[14px] text-ink-500">
            Laine, coton égyptien et lin sélectionnés pour leur tenue et leur
            confort au fil des saisons.
          </p>
        </div>
        <div>
          <p className="font-display italic text-2xl mb-2">Coupe</p>
          <p className="text-[14px] text-ink-500">
            Des silhouettes ajustées, pensées pour la morphologie de l'homme
            tunisien, avec retouche possible en atelier.
          </p>
        </div>
        <div>
          <p className="font-display italic text-2xl mb-2">Service</p>
          <p className="text-[14px] text-ink-500">
            Un conseiller vous répond directement sur WhatsApp, de la
            question de taille jusqu'à la livraison.
          </p>
        </div>
      </div>

      <StoreLocations stores={stores} />
    </div>
  );
}
