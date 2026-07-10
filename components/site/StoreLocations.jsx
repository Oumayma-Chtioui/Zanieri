import { MapPin, Phone, Clock } from "lucide-react";

export default function StoreLocations({ stores = [] }) {
  if (stores.length === 0) return null;

  return (
    <section className="bg-bone/50 border-y border-ink-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-widest2 text-bronze-dark">
            Nos adresses
          </span>
          <h2 className="font-display italic text-2xl sm:text-3xl mt-1">
            Visitez l'atelier
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <a
              key={store.id}
              href={store.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-ivory border border-ink-100 px-6 py-6 hover:border-bronze/50 transition-colors"
            >
              <h3 className="font-display text-lg mb-3">{store.name}</h3>
              <div className="space-y-2 text-[13px] text-ink-500">
                {store.address && (
                  <p className="flex items-start gap-2">
                    <MapPin size={15} className="mt-0.5 flex-none text-bronze-dark" />
                    {store.address}
                  </p>
                )}
                {store.phone && (
                  <p className="flex items-start gap-2">
                    <Phone size={15} className="mt-0.5 flex-none text-bronze-dark" />
                    {store.phone}
                  </p>
                )}
                {store.openingHours && (
                  <p className="flex items-start gap-2">
                    <Clock size={15} className="mt-0.5 flex-none text-bronze-dark" />
                    {store.openingHours}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
