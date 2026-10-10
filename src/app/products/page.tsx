import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/data/products";

export const metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-display text-5xl font-semibold">Shop products</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Browse IK Electronics products, appliances, gadgets, and office equipment.
        </p>
      </div>
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
          Products will appear here after they are added in Supabase.
        </div>
      )}
    </main>
  );
}
