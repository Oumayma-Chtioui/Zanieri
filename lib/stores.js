import { supabaseServer } from "./supabaseServer";

export async function getStores() {
  const { data, error } = await supabaseServer
    .from("stores")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("getStores error:", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone,
    openingHours: row.opening_hours,
    mapsUrl:
      row.maps_url ||
      (row.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            row.address
          )}`
        : ""),
    displayOrder: row.display_order,
  }));
}
