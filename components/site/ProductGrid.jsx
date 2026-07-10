import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], emptyMessage }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display italic text-xl text-ink-400">
          {emptyMessage || "Aucune pièce ne correspond à votre recherche."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
