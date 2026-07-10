import { getCategories } from "@/lib/categories";
import { getStoreSettings } from "@/lib/settings";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getStoreSettings(),
  ]);

  return (
    <CartProvider>
      <Header categories={categories} storeName={settings.storeName} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} categories={categories} />
      <WhatsAppFloat settings={settings} />
      <CartDrawer />
    </CartProvider>
  );
}
