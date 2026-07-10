import { getStoreSettings } from "@/lib/settings";
import CartLineList from "@/components/cart/CartLineList";
import OrderPanel from "@/components/cart/OrderPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Votre panier",
};

export default async function CartPage() {
  const settings = await getStoreSettings();

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="mb-10">
        <span className="text-[11px] uppercase tracking-widest2 text-bronze-dark">
          Panier
        </span>
        <h1 className="font-display italic text-3xl sm:text-4xl mt-1">
          Votre sélection
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <CartLineList />
        </div>
        <div>
          <OrderPanel settings={settings} />
        </div>
      </div>
    </div>
  );
}
