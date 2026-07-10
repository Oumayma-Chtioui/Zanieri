import { getProducts } from "@/lib/products";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zanieri.tn";
  const products = await getProducts();

  const staticRoutes = ["", "/products", "/about"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: p.createdAt ? new Date(p.createdAt) : new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
