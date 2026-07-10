"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, Check, EyeOff, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending | approved | all

  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error.message);
    setReviews(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "pending") return reviews.filter((r) => !r.approved);
    if (filter === "approved") return reviews.filter((r) => r.approved);
    return reviews;
  }, [reviews, filter]);

  async function setApproved(review, approved) {
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", review.id);
    if (error) {
      alert("Erreur : " + error.message);
      return;
    }
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, approved } : r)));
  }

  async function handleDelete(review) {
    if (!confirm("Supprimer définitivement cet avis ?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", review.id);
    if (error) {
      alert("Erreur : " + error.message);
      return;
    }
    setReviews((prev) => prev.filter((r) => r.id !== review.id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display italic text-2xl">Avis clients</h1>
          <p className="text-[13px] text-ink-400 mt-1">
            Les avis approuvés apparaissent sur la page d'accueil.
          </p>
        </div>
        <div className="flex gap-2">
          {[
            ["pending", "En attente"],
            ["approved", "Approuvés"],
            ["all", "Tous"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              data-active={filter === key ? "true" : "false"}
              className="swatch-chip px-4 py-2 text-[12px] uppercase tracking-widest2"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-ink-400 text-sm">Chargement...</p>
      ) : (
        <div className="bg-white border border-ink-100 divide-y divide-ink-100">
          {filtered.map((review) => (
            <div key={review.id} className="flex items-start gap-4 px-5 py-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < review.rating ? "fill-bronze text-bronze" : "text-ink-200"}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-sm">{review.name}</span>
                  <span
                    className={`text-[10px] uppercase tracking-widest2 px-1.5 py-0.5 ${
                      review.approved ? "bg-pine/10 text-pine" : "bg-bronze/10 text-bronze-dark"
                    }`}
                  >
                    {review.approved ? "Approuvé" : "En attente"}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-[14px] text-ink-600 leading-relaxed">{review.comment}</p>
                )}
                <p className="text-[11px] text-ink-400 mt-1.5">
                  {new Date(review.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex gap-2 flex-none">
                {!review.approved ? (
                  <button
                    onClick={() => setApproved(review, true)}
                    className="p-2 text-pine hover:bg-pine/10"
                    aria-label="Approuver"
                    title="Approuver"
                  >
                    <Check size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setApproved(review, false)}
                    className="p-2 text-bronze-dark hover:bg-bronze/10"
                    aria-label="Masquer"
                    title="Masquer"
                  >
                    <EyeOff size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review)}
                  className="p-2 text-red-700 hover:bg-red-50"
                  aria-label="Supprimer"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-5 py-10 text-center text-ink-400">Aucun avis dans cette catégorie.</p>
          )}
        </div>
      )}
    </div>
  );
}
