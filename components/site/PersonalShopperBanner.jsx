import { MessageCircle } from "lucide-react";

export default function PersonalShopperBanner({ settings }) {
  const number = (settings?.whatsapp || settings?.phone || "").replace(/\D/g, "");
  const link = number
    ? `https://wa.me/${number}?text=${encodeURIComponent(
        "Bonjour Zanieri, j'aimerais des conseils pour choisir ma tenue."
      )}`
    : "#";

  return (
    <section className="bg-pine text-ivory">
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h2 className="font-display italic text-2xl sm:text-3xl mb-2">
            Un conseil avant de commander ?
          </h2>
          <p className="text-ink-100/80 max-w-lg text-[14px]">
            Taille, coupe, étoffe — notre équipe répond en quelques minutes,
            directement sur WhatsApp.
          </p>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none inline-flex items-center gap-2 bg-ivory text-pine px-7 py-3.5 text-[12px] uppercase tracking-widest2 hover:bg-bone transition-colors"
        >
          <MessageCircle size={16} />
          Parler à un conseiller
        </a>
      </div>
    </section>
  );
}
