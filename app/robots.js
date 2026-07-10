export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zanieri.tn";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cart"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
