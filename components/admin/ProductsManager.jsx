"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Search, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { compressImageFile } from "@/lib/imageCompression";
import { slugify, formatPrice } from "@/lib/utils";

const EMPTY_FORM = {
  id: null,
  name: "",
  slug: "",
  category: "",
  price: "",
  old_price: "",
  fabric: "",
  fit: "",
  sizes: "",
  badge: "",
  stock: "0",
  description: "",
  is_featured: false,
  promotion_start: "",
  promotion_end: "",
  promotion_label: "",
  image_url: "",
};

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  async function loadData() {
    setLoading(true);
    const [{ data: prods, error: prodErr }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("display_order"),
    ]);
    if (prodErr) console.error(prodErr.message);
    setProducts(prods || []);
    setCategories(cats || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = search
        ? p.name.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setError("");
    setShowForm(true);
  }

  function openEdit(product) {
    setForm({
      id: product.id,
      name: product.name || "",
      slug: product.slug || "",
      category: product.category || "",
      price: product.price ?? "",
      old_price: product.old_price ?? "",
      fabric: product.fabric || "",
      fit: product.fit || "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
      badge: product.badge || "",
      stock: product.stock ?? "0",
      description: product.description || "",
      is_featured: !!product.is_featured,
      promotion_start: product.promotion_start || "",
      promotion_end: product.promotion_end || "",
      promotion_label: product.promotion_label || "",
      image_url: product.image_url || "",
    });
    setImageFile(null);
    setImagePreview(product.image_url || "");
    setError("");
    setShowForm(true);
  }

  function handleField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !prev.id) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let imageUrl = form.image_url;

      if (imageFile) {
        const compressed = await compressImageFile(imageFile);
        const path = `${slugify(form.slug || form.name)}-${Date.now()}.${
          compressed.name.split(".").pop() || "jpg"
        }`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, compressed, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        name: form.name.trim(),
        slug: slugify(form.slug || form.name),
        category: form.category,
        price: Number(form.price) || 0,
        old_price: form.old_price ? Number(form.old_price) : null,
        fabric: form.fabric.trim() || null,
        fit: form.fit.trim() || null,
        sizes: form.sizes
          ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        badge: form.badge.trim() || null,
        stock: Number(form.stock) || 0,
        description: form.description.trim() || null,
        is_featured: form.is_featured,
        promotion_start: form.promotion_start || null,
        promotion_end: form.promotion_end || null,
        promotion_label: form.promotion_label.trim() || null,
        image_url: imageUrl || null,
      };

      if (form.id) {
        const { error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", form.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert(payload);
        if (insertError) throw insertError;
      }

      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Supprimer "${product.name}" ? Cette action est définitive.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display italic text-2xl">Produits</h1>
          <p className="text-[13px] text-ink-400 mt-1">{products.length} pièce(s) au catalogue</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-ink text-ivory text-[12px] uppercase tracking-widest2"
        >
          <Plus size={15} />
          Ajouter un produit
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-ink-200 pl-9 pr-3 py-2.5 text-sm bg-white outline-none focus:border-ink"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-ink-200 px-3 py-2.5 text-[13px] bg-white outline-none"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-ink-400 text-sm">Chargement...</p>
      ) : (
        <div className="bg-white border border-ink-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest2 text-ink-400 border-b border-ink-100">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Vedette</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-ink-50 hover:bg-bone/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 flex-none bg-bone/60 border border-ink-100">
                        {product.image_url && (
                          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{product.category}</td>
                  <td className="px-4 py-3 font-mono">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock <= 0 ? "text-red-700" : "text-ink-600"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.is_featured ? "Oui" : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(product)} className="p-2 hover:text-bronze-dark" aria-label="Modifier">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(product)} className="p-2 hover:text-red-700" aria-label="Supprimer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-ink-400">
                    Aucun produit ne correspond à ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-ink/40 p-4 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="bg-white w-full max-w-2xl my-8 border border-ink-100"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-ink-100">
              <h2 className="font-display italic text-lg">
                {form.id ? "Modifier le produit" : "Nouveau produit"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-2">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6 grid sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <div className="sm:col-span-2">
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Nom du produit *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleField("name", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Slug (URL)
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => handleField("slug", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm font-mono outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Catégorie *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => handleField("category", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
                >
                  <option value="">Choisir...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Prix (DT) *
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => handleField("price", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm font-mono outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Ancien prix (promo)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.old_price}
                  onChange={(e) => handleField("old_price", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm font-mono outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Matière
                </label>
                <input
                  value={form.fabric}
                  onChange={(e) => handleField("fabric", e.target.value)}
                  placeholder="Laine, coton..."
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Coupe
                </label>
                <input
                  value={form.fit}
                  onChange={(e) => handleField("fit", e.target.value)}
                  placeholder="Slim, Regular..."
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Tailles disponibles (séparées par des virgules)
                </label>
                <input
                  value={form.sizes}
                  onChange={(e) => handleField("sizes", e.target.value)}
                  placeholder="S, M, L, XL"
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Badge
                </label>
                <input
                  value={form.badge}
                  onChange={(e) => handleField("badge", e.target.value)}
                  placeholder="Nouveau, Édition limitée..."
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Stock
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => handleField("stock", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm font-mono outline-none focus:border-ink"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleField("description", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink resize-none"
                />
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Début promotion
                </label>
                <input
                  type="date"
                  value={form.promotion_start}
                  onChange={(e) => handleField("promotion_start", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Fin promotion
                </label>
                <input
                  type="date"
                  value={form.promotion_end}
                  onChange={(e) => handleField("promotion_end", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={(e) => handleField("is_featured", e.target.checked)}
                  className="accent-bronze"
                />
                <label htmlFor="is_featured" className="text-sm">
                  Mettre en vedette sur la page d'accueil
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Photo du produit
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-20 flex-none bg-bone/60 border border-ink-100">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-ink-300">
                        <ImagePlus size={20} />
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="text-sm" />
                </div>
                <p className="text-[11px] text-ink-400 mt-1.5">
                  L'image est compressée automatiquement avant l'envoi (~150 Ko).
                </p>
              </div>
            </div>

            {error && <p className="px-6 text-[13px] text-red-700">{error}</p>}

            <div className="flex justify-end gap-3 px-6 py-5 border-t border-ink-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-ink-200 text-[12px] uppercase tracking-widest2"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-ink text-ivory text-[12px] uppercase tracking-widest2 disabled:opacity-60"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
