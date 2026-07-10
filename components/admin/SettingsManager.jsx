"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { compressImageFile } from "@/lib/imageCompression";

const EMPTY = {
  store_name: "",
  phone: "",
  email: "",
  address: "",
  facebook: "",
  instagram: "",
  whatsapp: "",
  opening_hours: "",
  delivery_fee: "0",
  minimum_order: "0",
  hero_title: "",
  hero_subtitle: "",
  hero_image_url: "",
  google_rating: "",
  google_rating_count: "",
  google_maps_url: "",
};

export default function SettingsManager() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) console.error(error.message);
      if (data) {
        setForm({
          store_name: data.store_name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          whatsapp: data.whatsapp || "",
          opening_hours: data.opening_hours || "",
          delivery_fee: data.delivery_fee ?? "0",
          minimum_order: data.minimum_order ?? "0",
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          hero_image_url: data.hero_image_url || "",
          google_rating: data.google_rating ?? "",
          google_rating_count: data.google_rating_count ?? "",
          google_maps_url: data.google_maps_url || "",
        });
        setImagePreview(data.hero_image_url || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus("");

    try {
      let heroImageUrl = form.hero_image_url;

      if (imageFile) {
        const compressed = await compressImageFile(imageFile, { maxWidthOrHeight: 1920 });
        const path = `hero-${Date.now()}.${compressed.name.split(".").pop() || "jpg"}`;
        const { error: uploadError } = await supabase.storage
          .from("site-banners")
          .upload(path, compressed, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        const { data: pub } = supabase.storage.from("site-banners").getPublicUrl(path);
        heroImageUrl = pub.publicUrl;
      }

      const payload = {
        id: 1,
        store_name: form.store_name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        address: form.address.trim() || null,
        facebook: form.facebook.trim() || null,
        instagram: form.instagram.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        opening_hours: form.opening_hours.trim() || null,
        delivery_fee: Number(form.delivery_fee) || 0,
        minimum_order: Number(form.minimum_order) || 0,
        hero_title: form.hero_title.trim() || null,
        hero_subtitle: form.hero_subtitle.trim() || null,
        hero_image_url: heroImageUrl || null,
        google_rating: form.google_rating ? Number(form.google_rating) : null,
        google_rating_count: form.google_rating_count ? Number(form.google_rating_count) : null,
        google_maps_url: form.google_maps_url.trim() || null,
      };

      const { error } = await supabase.from("store_settings").upsert(payload);
      if (error) throw error;

      setStatus("Paramètres enregistrés.");
    } catch (err) {
      setStatus("Erreur : " + (err.message || "impossible d'enregistrer."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-ink-400 text-sm">Chargement...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display italic text-2xl mb-6">Paramètres de la boutique</h1>

      <form onSubmit={handleSave} className="bg-white border border-ink-100 px-6 py-6 space-y-8">
        <section>
          <h2 className="text-[12px] uppercase tracking-widest2 text-bronze-dark mb-4">Identité</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nom de la boutique" value={form.store_name} onChange={(v) => handleField("store_name", v)} />
            <Field label="E-mail" value={form.email} onChange={(v) => handleField("email", v)} />
            <Field label="Téléphone" value={form.phone} onChange={(v) => handleField("phone", v)} />
            <Field label="Numéro WhatsApp (avec code pays)" value={form.whatsapp} onChange={(v) => handleField("whatsapp", v)} placeholder="21600000000" />
            <Field label="Adresse" value={form.address} onChange={(v) => handleField("address", v)} className="sm:col-span-2" />
            <Field label="Horaires d'ouverture" value={form.opening_hours} onChange={(v) => handleField("opening_hours", v)} className="sm:col-span-2" />
          </div>
        </section>

        <section>
          <h2 className="text-[12px] uppercase tracking-widest2 text-bronze-dark mb-4">Réseaux sociaux</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Lien Instagram" value={form.instagram} onChange={(v) => handleField("instagram", v)} />
            <Field label="Lien Facebook" value={form.facebook} onChange={(v) => handleField("facebook", v)} />
          </div>
        </section>

        <section>
          <h2 className="text-[12px] uppercase tracking-widest2 text-bronze-dark mb-4">Livraison</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Frais de livraison (DT)" type="number" value={form.delivery_fee} onChange={(v) => handleField("delivery_fee", v)} />
            <Field label="Commande minimum (DT)" type="number" value={form.minimum_order} onChange={(v) => handleField("minimum_order", v)} />
          </div>
        </section>

        <section>
          <h2 className="text-[12px] uppercase tracking-widest2 text-bronze-dark mb-4">Page d'accueil</h2>
          <div className="space-y-4">
            <Field label="Titre principal" value={form.hero_title} onChange={(v) => handleField("hero_title", v)} />
            <Field label="Sous-titre" value={form.hero_subtitle} onChange={(v) => handleField("hero_subtitle", v)} />
            <div>
              <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
                Image d'accueil
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
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[12px] uppercase tracking-widest2 text-bronze-dark mb-4">Réputation Google</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Note (ex: 4.8)" type="number" step="0.1" value={form.google_rating} onChange={(v) => handleField("google_rating", v)} />
            <Field label="Nombre d'avis" type="number" value={form.google_rating_count} onChange={(v) => handleField("google_rating_count", v)} />
            <Field label="Lien Google Maps" value={form.google_maps_url} onChange={(v) => handleField("google_maps_url", v)} />
          </div>
        </section>

        {status && (
          <p className={`text-[13px] ${status.startsWith("Erreur") ? "text-red-700" : "text-pine"}`}>
            {status}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-ink text-ivory text-[12px] uppercase tracking-widest2 disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", step, placeholder, className = "" }) {
  return (
    <div className={className}>
      <label className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink"
      />
    </div>
  );
}
