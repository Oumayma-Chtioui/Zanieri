import { formatPrice } from "./utils";

// Strips anything that isn't a digit, since wa.me links require a plain
// international number (country code + number, no +, spaces or dashes).
function sanitizeNumber(raw) {
  return (raw || "").replace(/\D/g, "");
}

// Builds a ready-to-send WhatsApp order message from the cart, and the
// full wa.me link the checkout button redirects to. `customer` is an
// optional { name, phone, address, note } object collected on the cart
// page before redirecting.
export function buildWhatsAppOrder({ items, total, settings, customer }) {
  const number = sanitizeNumber(
    settings?.whatsapp || settings?.phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  );

  const lines = [];
  lines.push(`Bonjour ${settings?.storeName || "Zanieri"} 👋`);
  lines.push("Je souhaite commander :");
  lines.push("");

  items.forEach((item, index) => {
    const sizeLabel = item.size ? ` — Taille ${item.size}` : "";
    lines.push(
      `${index + 1}. ${item.name}${sizeLabel} x${item.quantity} — ${formatPrice(
        item.price * item.quantity
      )}`
    );
  });

  lines.push("");
  lines.push(`Total : ${formatPrice(total)}`);

  if (customer?.name || customer?.phone || customer?.address) {
    lines.push("");
    lines.push("— Mes coordonnées —");
    if (customer?.name) lines.push(`Nom : ${customer.name}`);
    if (customer?.phone) lines.push(`Téléphone : ${customer.phone}`);
    if (customer?.address) lines.push(`Adresse de livraison : ${customer.address}`);
  }

  if (customer?.note) {
    lines.push("");
    lines.push(`Note : ${customer.note}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  const link = number ? `https://wa.me/${number}?text=${text}` : null;

  return { text: lines.join("\n"), link };
}
