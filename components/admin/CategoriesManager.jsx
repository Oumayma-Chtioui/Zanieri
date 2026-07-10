"use client";

import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { slugify } from "@/lib/utils";

const EMPTY_FORM = { id: null, name: "", slug: "", icon: "Shirt" };

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    if (error) console.error(error.message);
    setCategories(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreate() {
    setForm({ ...EMPTY_FORM });
    setError("");
    setShowForm(true);
  }

  function openEdit(cat) {
    setForm({ id: cat.id, name: cat.name, slug: cat.slug, icon: cat.icon || "Shirt" });
    setError("");
    setShowForm(true);
  }

  function handleField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !prev.id) next.slug = slugify(value);
      return next;
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      icon: form.icon.trim() || "Shirt",
    };

    try {
      if (form.id) {
        const { error } = await supabase.from("categories").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const maxOrder = categories.reduce((max, c) => Math.max(max, c.display_order || 0), 0);
        const { error } = await supabase
          .from("categories")
          .insert({ ...payload, display_order: maxOrder + 1 });
        if (error) throw error;
      }
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat) {
    if (!confirm(`Supprimer la catégorie "${cat.name}" ?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", cat.id);
    if (error) {
      alert("Erreur : " + error.message + " — vérifiez qu'aucun produit n'utilise cette catégorie.");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
  }

  async function handleReorder(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;
    const list = [...categories];
    [list[index], list[target]] = [list[target], list[index]];
    setCategories(list);

    await Promise.all(
      list.map((cat, i) =>
        supabase.from("categories").update({ display_order: i + 1 }).eq("id", cat.id)
      )
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display italic text-2xl">Catégories</h1>
          <p className="text-[13px] text-ink-400 mt-1">
            L'ordre ci-dessous définit l'ordre d'affichage sur le site.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-ink text-ivory text-[12px] uppercase tracking-widest2"
        >
          <Plus size={15} />
          Ajouter
        </button>
      </div>

      {loading ? (
        <p className="text-ink-400 text-sm">Chargement...</p>
      ) : (
        <div className="bg-white border border-ink-100 divide-y divide-ink-100">
          {categories.map((cat, index) => {
            const Icon = Icons[cat.icon] || Icons.Shirt;
            return (
              <div key={cat.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex flex-col">
                  <button
                    onClick={() => handleReorder(index, -1)}
                    disabled={index === 0}
                    className="disabled:opacity-30"
                    aria-label="Monter"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => handleReorder(index, 1)}
                    disabled={index === categories.length - 1}
                    className="disabled:opacity-30"
                    aria-label="Descendre"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                <Icon size={20} strokeWidth={1.4} className="text-bronze-dark flex-none" />
                <div className="flex-1">
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-[12px] text-ink-400 font-mono">{cat.slug} — icône: {cat.icon}</p>
                </div>
                <button onClick={() => openEdit(cat)} className="p-2 hover:text-bronze-dark" aria-label="Modifier">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(cat)} className="p-2 hover:text-red-700" aria-label="Supprimer">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="px-5 py-10 text-center text-ink-400">Aucune catégorie pour le moment.</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <form onSubmit={handleSave} className="bg-white w-full max-w-md border border-ink-100">
            <div className="flex items-center justify-between px-6 h-16 border-b border-ink-100">
              <h2 className="font-display italic text-lg">
                {form.id ? "Modifier la catégorie" : "Nouvelle catégorie"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-2">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Nom *
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
                  Slug
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => handleField("slug", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm font-mono outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                  Icône (nom Lucide, ex: Shirt, Watch, Footprints)
                </label>
                <input
                  value={form.icon}
                  onChange={(e) => handleField("icon", e.target.value)}
                  className="w-full border border-ink-200 px-3 py-2.5 text-sm font-mono outline-none focus:border-ink"
                />
                <p className="text-[11px] text-ink-400 mt-1.5">
                  Liste complète des icônes : lucide.dev/icons
                </p>
              </div>
            </div>

            {error && <p className="px-6 text-[13px] text-red-700 mb-2">{error}</p>}

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
