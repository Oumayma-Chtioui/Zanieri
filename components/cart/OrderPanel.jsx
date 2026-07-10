"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { buildWhatsAppOrder } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

export default function OrderPanel({ settings }) {
  const { items, subtotal, clearCart } = useCart();
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [error, setError] = useState("");

  const deliveryFee = Number(settings?.deliveryFee || 0);
  const total = subtotal + (subtotal > 0 ? deliveryFee : 0);

  function handleChange(field, value) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

  function handleCheckout() {
    if (!customer.name.trim() || !customer.phone.trim()) {
      setError("Merci d'indiquer votre nom et votre numéro de téléphone.");
      return;
    }
    setError("");

    const { link } = buildWhatsAppOrder({
      items,
      total,
      settings,
      customer,
    });

    if (!link) {
      setError(
        "Le numéro WhatsApp de la boutique n'est pas configuré. Contactez-nous directement."
      );
      return;
    }

    window.open(link, "_blank");
    clearCart();
  }

  return (
    <div className="border border-ink-100 px-6 py-7 space-y-6 sticky top-28">
      <h2 className="font-display italic text-xl">Vos coordonnées</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nom complet"
          value={customer.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full border border-ink-200 px-4 py-3 text-sm bg-ivory focus:border-ink outline-none"
        />
        <input
          type="tel"
          placeholder="Numéro de téléphone"
          value={customer.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full border border-ink-200 px-4 py-3 text-sm bg-ivory focus:border-ink outline-none"
        />
        <input
          type="text"
          placeholder="Adresse de livraison"
          value={customer.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="w-full border border-ink-200 px-4 py-3 text-sm bg-ivory focus:border-ink outline-none"
        />
        <textarea
          placeholder="Note (taille, préférence de couleur...)"
          value={customer.note}
          onChange={(e) => handleChange("note", e.target.value)}
          rows={2}
          className="w-full border border-ink-200 px-4 py-3 text-sm bg-ivory focus:border-ink outline-none resize-none"
        />
      </div>

      <div className="stitch-divider" />

      <div className="space-y-2 text-[14px]">
        <div className="flex justify-between text-ink-500">
          <span>Sous-total</span>
          <span className="font-mono">{formatPrice(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-ink-500">
            <span>Livraison</span>
            <span className="font-mono">{formatPrice(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between font-display text-lg pt-1">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {error && <p className="text-[13px] text-red-700">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full py-4 bg-pine text-ivory text-[12px] uppercase tracking-widest2 hover:bg-pine-light transition-colors disabled:opacity-40"
      >
        Envoyer la commande sur WhatsApp
      </button>
      <p className="text-[12px] text-ink-400 text-center">
        Vous serez redirigé vers WhatsApp avec votre commande déjà rédigée.
      </p>
    </div>
  );
}
