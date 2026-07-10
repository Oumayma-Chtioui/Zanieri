import { supabaseServer } from "./supabaseServer";

const DEFAULTS = {
  storeName: "Zanieri",
  phone: "",
  email: "",
  address: "",
  facebook: "",
  instagram: "",
  whatsapp: "",
  openingHours: "",
  deliveryFee: 0,
  minimumOrder: 0,
  heroTitle: "L'élégance masculine, taillée pour la Tunisie.",
  heroSubtitle:
    "Costumes, chemises et pièces sur-mesure — commandez en un message.",
  heroImageUrl: null,
  googleRating: 0,
  googleRatingCount: 0,
  googleMapsUrl: "",
};

export async function getStoreSettings() {
  const { data, error } = await supabaseServer
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getStoreSettings error:", error.message);
    return DEFAULTS;
  }

  return {
    storeName: data.store_name || DEFAULTS.storeName,
    phone: data.phone || "",
    email: data.email || "",
    address: data.address || "",
    facebook: data.facebook || "",
    instagram: data.instagram || "",
    whatsapp: data.whatsapp || "",
    openingHours: data.opening_hours || "",
    deliveryFee: data.delivery_fee ?? 0,
    minimumOrder: data.minimum_order ?? 0,
    heroTitle: data.hero_title || DEFAULTS.heroTitle,
    heroSubtitle: data.hero_subtitle || DEFAULTS.heroSubtitle,
    heroImageUrl: data.hero_image_url || null,
    googleRating: data.google_rating ?? 0,
    googleRatingCount: data.google_rating_count ?? 0,
    googleMapsUrl: data.google_maps_url || "",
  };
}
