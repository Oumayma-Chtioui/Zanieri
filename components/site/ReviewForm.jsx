"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setStatus("saving");
    const { error } = await supabase.from("reviews").insert({
      name: name.trim(),
      rating,
      comment: comment.trim() || null,
      approved: false,
    });

    if (error) {
      console.error("Review submit error:", error.message);
      setStatus("error");
      return;
    }

    setStatus("done");
    setName("");
    setComment("");
    setRating(5);
  }

  if (status === "done") {
    return (
      <div className="border border-bronze/40 bg-bone/50 px-6 py-8 text-center">
        <p className="font-display italic text-lg mb-1">Merci pour votre avis</p>
        <p className="text-sm text-ink-500">
          Il sera visible dès sa validation par notre équipe.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink-100 px-6 py-8">
      <p className="font-display italic text-lg mb-5">Laisser un avis</p>

      <div className="flex items-center gap-1.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          const active = value <= (hoverRating || rating);
          return (
            <button
              type="button"
              key={value}
              aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
              className="p-0.5"
            >
              <Star
                size={22}
                className={active ? "fill-bronze text-bronze" : "text-ink-200"}
              />
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          required
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-ink-200 px-4 py-3 text-sm bg-ivory focus:border-ink outline-none"
        />
        <textarea
          placeholder="Votre expérience (facultatif)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full border border-ink-200 px-4 py-3 text-sm bg-ivory focus:border-ink outline-none resize-none"
        />
        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full py-3.5 bg-ink text-ivory text-[12px] uppercase tracking-widest2 hover:bg-ink-700 transition-colors disabled:opacity-60"
        >
          {status === "saving" ? "Envoi..." : "Envoyer mon avis"}
        </button>
        {status === "error" && (
          <p className="text-[13px] text-red-700">
            Une erreur est survenue. Merci de réessayer.
          </p>
        )}
      </div>
    </form>
  );
}
