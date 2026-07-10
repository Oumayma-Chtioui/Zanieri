import { Star } from "lucide-react";
import ReviewForm from "./ReviewForm";

function ReviewCard({ review }) {
  return (
    <div className="border border-ink-100 bg-ivory px-6 py-6 flex flex-col">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={
              i < review.rating ? "fill-bronze text-bronze" : "text-ink-200"
            }
          />
        ))}
      </div>
      {review.comment && (
        <p className="text-[14px] text-ink-600 leading-relaxed mb-4">
          "{review.comment}"
        </p>
      )}
      <p className="mt-auto text-[12px] uppercase tracking-widest2 text-ink-400">
        {review.name}
      </p>
    </div>
  );
}

export default function ReviewsSection({ reviews = [] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-8">
        <span className="text-[11px] uppercase tracking-widest2 text-bronze-dark">
          Voix de nos clients
        </span>
        <h2 className="font-display italic text-2xl sm:text-3xl mt-1">
          Ce qu'ils en disent
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {reviews.length === 0 ? (
            <p className="text-ink-400 italic font-display">
              Soyez le premier à partager votre expérience.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
        <div>
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
