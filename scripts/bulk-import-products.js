/**
 * Optional local tool — NOT part of the deployed app.
 *
 * Reads scripts/products-import.json, uploads any local image referenced
 * per product to the `product-images` bucket, then upserts the product
 * row matched by `slug`. Uses the Supabase service role key so it can
 * bypass RLS — never expose that key to the browser or commit it.
 *
 * Usage:
 *   1. Copy .env.example to .env.local and fill in SUPABASE_SERVICE_ROLE_KEY
 *      (Project Settings > API > service_role, NOT the anon key).
 *   2. Copy scripts/products-import.example.json to
 *      scripts/products-import.json and edit it with your real products.
 *   3. Run: npm run import:products
 */

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const DATA_FILE = path.join(__dirname, "products-import.json");

function slugify(input) {
  return (input || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadLocalImage(localPath) {
  const absolute = path.isAbsolute(localPath)
    ? localPath
    : path.join(__dirname, localPath);

  if (!fs.existsSync(absolute)) {
    console.warn(`  ! Image not found, skipping: ${absolute}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(absolute);
  const ext = path.extname(absolute) || ".jpg";
  const storagePath = `${slugify(path.basename(absolute, ext))}-${Date.now()}${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(storagePath, fileBuffer, {
      contentType: `image/${ext.replace(".", "")}`,
      upsert: false,
    });

  if (error) {
    console.warn(`  ! Upload failed for ${absolute}: ${error.message}`);
    return null;
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(storagePath);
  return data.publicUrl;
}

async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(
      `No scripts/products-import.json found. Copy products-import.example.json and edit it first.`
    );
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  console.log(`Importing ${products.length} product(s)...`);

  for (const product of products) {
    const slug = slugify(product.slug || product.name);
    console.log(`\n→ ${product.name} (${slug})`);

    let imageUrl = product.image_url || null;
    if (product.local_image) {
      const uploaded = await uploadLocalImage(product.local_image);
      if (uploaded) imageUrl = uploaded;
    }

    const payload = {
      slug,
      name: product.name,
      category: product.category,
      price: Number(product.price) || 0,
      old_price: product.old_price ? Number(product.old_price) : null,
      fabric: product.fabric || null,
      fit: product.fit || null,
      sizes: product.sizes || [],
      badge: product.badge || null,
      stock: Number(product.stock) || 0,
      description: product.description || null,
      is_featured: !!product.is_featured,
      image_url: imageUrl,
    };

    const { error } = await supabase.from("products").upsert(payload, { onConflict: "slug" });
    if (error) {
      console.error(`  ! Failed to upsert ${slug}: ${error.message}`);
    } else {
      console.log(`  ✓ Saved`);
    }
  }

  console.log("\nDone.");
}

main();
