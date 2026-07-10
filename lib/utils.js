export function formatPrice(value) {
  const n = Number(value) || 0;
  return `${n.toFixed(2)} DT`;
}

export function slugify(input) {
  return (input || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

// A product is "on promo" if old_price is set AND, when start/end dates
// are present, today falls within that window. Rows with no dates set
// are treated as always-active promos. Kept here (rather than in
// lib/products.js) so client components can import it without pulling
// the server-only Supabase client into their bundle.
export function isOnPromotion(product) {
  if (!product?.oldPrice) return false;
  const today = new Date();
  if (product.promotionStart && new Date(product.promotionStart) > today) {
    return false;
  }
  if (product.promotionEnd && new Date(product.promotionEnd) < today) {
    return false;
  }
  return true;
}
