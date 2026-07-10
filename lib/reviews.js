import { supabaseServer } from "./supabaseServer";

export async function getApprovedReviews(limit = 12) {
  const { data, error } = await supabaseServer
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getApprovedReviews error:", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  }));
}
