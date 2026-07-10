import { Fraunces, Jost, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.zanieri.tn"
  ),
  title: {
    default: "Zanieri — Vêtements pour homme, Tunisie",
    template: "%s | Zanieri",
  },
  description:
    "Zanieri, maison de prêt-à-porter pour homme en Tunisie. Costumes, chemises, blazers et pièces sur-mesure. Commande directe par WhatsApp.",
  keywords: [
    "Zanieri",
    "vêtements homme Tunisie",
    "costume homme Tunisie",
    "chemise homme",
    "prêt-à-porter homme",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${jost.variable} ${plexMono.variable}`}
    >
      <body className="font-body bg-ivory text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
