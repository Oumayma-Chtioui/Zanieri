import { supabaseServer } from "./supabaseServer";

export async function getCategories() {
  const { data, error } = await supabaseServer
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("getCategories error:", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.slug,
    dbId: row.id,
    name: row.name,
    icon: row.icon,
    displayOrder: row.display_order,
  }));
}
