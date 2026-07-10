import { Star } from "lucide-react";

export default function TrustBar({ settings }) {
  const { googleRating, googleRatingCount, googleMapsUrl } = settings;
  if (!googleRating) return null;

  return (
    <div className="bg-bone/60 border-y border-ink-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.round(googleRating)
                  ? "fill-bronze text-bronze"
                  : "text-ink-200"
              }
            />
          ))}
        </div>
        <span className="text-[13px] text-ink-600">
          {googleRating.toFixed(1)} sur Google
          {googleRatingCount ? ` — ${googleRatingCount} avis` : ""}
        </span>
        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] uppercase tracking-widest2 text-bronze-dark stitch-underline pb-0.5"
          >
            Voir sur Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
