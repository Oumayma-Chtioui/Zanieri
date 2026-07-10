import { supabaseServer } from "./supabaseServer";
import { isOnPromotion } from "./utils";

export { isOnPromotion };

function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    fabric: row.fabric || "",
    fit: row.fit || "",
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    imageUrl: row.image_url || null,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    badge: row.badge || "",
    rating: row.rating != null ? Number(row.rating) : 0,
    reviewsCount: row.reviews_count || 0,
    stock: row.stock ?? 0,
    description: row.description || "",
    isFeatured: !!row.is_featured,
    promotionStart: row.promotion_start,
    promotionEnd: row.promotion_end,
    promotionLabel: row.promotion_label || "",
    createdAt: row.created_at,
  };
}

export async function getProducts() {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts error:", error.message);
    return [];
  }
  return (data || []).map(mapProduct);
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug error:", error.message);
    return null;
  }
  return mapProduct(data);
}

export async function getFeaturedProducts(limit = 8) {
  const all = await getProducts();
  const featured = all.filter((p) => p.isFeatured);
  if (featured.length > 0) return featured.slice(0, limit);
  // Fallback: top-rated products if nothing is marked featured.
  return [...all].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export async function getRelatedProducts(product, limit = 4) {
  const all = await getProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
