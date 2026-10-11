import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories, getProducts } from "@/lib/data/products";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const [products, categories, params] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams,
  ]);

  const activeCategory = params.category ?? "";
  const query = (params.q ?? "").toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory =
      !activeCategory ||
      product.category_id ===
        categories.find((c) => c.slug === activeCategory)?.id ||
      (product.tags ?? []).some((t) => t.toLowerCase() === activeCategory.toLowerCase());
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      (product.description ?? "").toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-eyebrow text-primary">The catalogue</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">
            {activeCategory
              ? categories.find((c) => c.slug === activeCategory)?.name ?? "Products"
              : "All products"}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Genuine electronics, appliances, gadgets and office equipment — add to cart or chat
            with us on WhatsApp.
          </p>
        </div>
        <form action="/products" method="get" className="flex w-full max-w-sm items-center gap-2">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search products..."
            className="h-11 w-full rounded-md border border-input bg-card px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search products"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </div>

      {categories.length > 0 ? (
        <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
          <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Browse
          </span>
          {[{ slug: "", name: "All" }, ...categories].map((category) => {
            const active = activeCategory === category.slug;
            return active ? (
              <Link
                key={category.slug || "all"}
                href="/products"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground"
              >
                {category.name}
                <X className="size-3.5" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                key={category.slug || "all"}
                href={category.slug ? `/products?category=${encodeURIComponent(category.slug)}` : "/products"}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-muted",
                )}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      ) : null}

      <div className="mt-8">
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No products match your search. Try another category or keyword — or{" "}
              <Link href="/#contact" className="font-semibold text-primary hover:underline">
                ask us on WhatsApp
              </Link>
              .
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}