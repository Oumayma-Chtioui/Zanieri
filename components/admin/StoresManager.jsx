"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const EMPTY_FORM = { id: null, name: "", address: "", phone: "", opening_hours: "", maps_url: "" };

export default function StoresManager() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase.from("stores").select("*").order("display_order");
    if (error) console.error(error.message);
    setStores(data || []);
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

  function openEdit(store) {
    setForm({
      id: store.id,
      name: store.name || "",
      address: store.address || "",
      phone: store.phone || "",
      opening_hours: store.opening_hours || "",
      maps_url: store.maps_url || "",
    });
    setError("");
    setShowForm(true);
  }

  function handleField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
      opening_hours: form.opening_hours.trim() || null,
      maps_url: form.maps_url.trim() || null,
    };

    try {
      if (form.id) {
        const { error } = await supabase.from("stores").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const maxOrder = stores.reduce((max, s) => Math.max(max, s.display_order || 0), 0);
        const { error } = await supabase.from("stores").insert({ ...payload, display_order: maxOrder + 1 });
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

  async function handleDelete(store) {
    if (!confirm(`Supprimer l'adresse "${store.name}" ?`)) return;
    const { error } = await supabase.from("stores").delete().eq("id", store.id);
    if (error) {
      alert("Erreur : " + error.message);
      return;
    }
    setStores((prev) => prev.filter((s) => s.id !== store.id));
  }

  async function handleReorder(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= stores.length) return;
    const list = [...stores];
    [list[index], list[target]] = [list[target], list[index]];
    setStores(list);
    await Promise.all(
      list.map((s, i) => supabase.from("stores").update({ display_order: i + 1 }).eq("id", s.id))
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display italic text-2xl">Adresses &amp; points de vente</h1>
          <p className="text-[13px] text-ink-400 mt-1">
            Affichées sur la page d'accueil et la page "La Maison".
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-ink text-ivory text-[12px] uppercase tracking-widest2"
        >
          <Plus size={15} />
          Ajouter une adresse
        </button>
      </div>

      {loading ? (
        <p className="text-ink-400 text-sm">Chargement...</p>
      ) : (
        <div className="bg-white border border-ink-100 divide-y divide-ink-100">
          {stores.map((store, index) => (
            <div key={store.id} className="flex items-start gap-4 px-5 py-4">
              <div className="flex flex-col pt-1">
                <button onClick={() => handleReorder(index, -1)} disabled={index === 0} className="disabled:opacity-30" aria-label="Monter">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => handleReorder(index, 1)} disabled={index === stores.length - 1} className="disabled:opacity-30" aria-label="Descendre">
                  <ArrowDown size={14} />
                </button>
              </div>
              <MapPin size={18} className="text-bronze-dark flex-none mt-1" />
              <div className="flex-1">
                <p className="font-medium">{store.name}</p>
                <p className="text-[13px] text-ink-500">{store.address}</p>
                <p className="text-[12px] text-ink-400">{store.phone} {store.opening_hours && `— ${store.opening_hours}`}</p>
              </div>
              <button onClick={() => openEdit(store)} className="p-2 hover:text-bronze-dark" aria-label="Modifier">
                <Pencil size={15} />
              </button>
              <button onClick={() => handleDelete(store)} className="p-2 hover:text-red-700" aria-label="Supprimer">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {stores.length === 0 && (
            <p className="px-5 py-10 text-center text-ink-400">Aucune adresse enregistrée.</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <form onSubmit={handleSave} className="bg-white w-full max-w-md border border-ink-100">
            <div className="flex items-center justify-between px-6 h-16 border-b border-ink-100">
              <h2 className="font-display italic text-lg">
                {form.id ? "Modifier l'adresse" : "Nouvelle adresse"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-2">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              <Field label="Nom du point de vente *" value={form.name} onChange={(v) => handleField("name", v)} required />
              <Field label="Adresse" value={form.address} onChange={(v) => handleField("address", v)} />
              <Field label="Téléphone" value={form.phone} onChange={(v) => handleField("phone", v)} />
              <Field label="Horaires" value={form.opening_hours} onChange={(v) => handleField("opening_hours", v)} />
              <div>
                <Field
                  label="Lien Google Maps (partager > copier le lien)"
                  value={form.maps_url}
                  onChange={(v) => handleField("maps_url", v)}
                />
              </div>
            </div>
            {error && <p className="px-6 text-[13px] text-red-700 mb-2">{error}</p>}
            <div className="flex justify-end gap-3 px-6 py-5 border-t border-ink-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-ink-200 text-[12px] uppercase tracking-widest2">
                Annuler
              </button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 bg-ink text-ivory text-[12px] uppercase tracking-widest2 disabled:opacity-60">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, required = false }) {
  return (
    <div>
      <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
        {label}
      </label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
      />
    </div>
  );
}
