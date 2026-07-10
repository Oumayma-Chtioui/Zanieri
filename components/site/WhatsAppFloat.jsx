"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat({ settings }) {
  const number = (settings?.whatsapp || settings?.phone || "").replace(/\D/g, "");
  if (!number) return null;

  const link = `https://wa.me/${number}?text=${encodeURIComponent(
    "Bonjour Zanieri, j'aimerais avoir plus d'informations."
  )}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Zanieri sur WhatsApp"
      className="fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full bg-pine text-ivory flex items-center justify-center shadow-soft hover:bg-pine-light transition-colors"
    >
      <MessageCircle size={24} strokeWidth={1.6} />
    </a>
  );
}
