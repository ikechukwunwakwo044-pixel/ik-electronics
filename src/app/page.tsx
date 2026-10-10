import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories, getFeaturedProducts } from "@/lib/data/products";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(161,98,7,0.22),transparent_34%),linear-gradient(135deg,#0c0a09_0%,#292524_52%,#fafaf9_52%,#fafaf9_100%)]" />
        <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-2xl text-white">
            <Badge className="border-white/20 bg-white/10 text-white">Electronics, appliances, office essentials</Badge>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
              Premium gadgets and appliances that sell themselves.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-stone-200 sm:text-lg">
              Discover televisions, kitchen appliances, speakers, office equipment, and smart combo deals curated for homes and businesses.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg">
                <Link href="/products">
                  Shop products
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="#combos">View combo deals</Link>
              </Button>
            </div>
          </div>

          <div className="glass-panel rounded-lg p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Smart TVs",
                "Kitchen appliances",
                "Home theaters",
                "Office equipment",
              ].map((item) => (
                <div key={item} className="rounded-lg border bg-white/78 p-5">
                  <p className="font-semibold">{item}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Ready for fast inquiry and delivery support.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: BadgeCheck, title: "Trusted product guidance", body: "Clear product details so customers can choose confidently." },
            { icon: PackageCheck, title: "Combo offers", body: "Smart bundles that increase value and make buying easier." },
            { icon: Truck, title: "Fast sales follow-up", body: "WhatsApp-first support for inquiries, orders, and delivery updates." },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="size-7 text-accent" aria-hidden="true" />
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">{item.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-4xl font-semibold">Featured products</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Fresh picks from the IK Electronics catalog.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">Browse all products</Link>
            </Button>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Featured products will appear here after they are added in Supabase.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section id="combos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-4xl font-semibold">Product categories built for quick decisions</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Use categories and combo offers to guide customers from interest to checkout faster.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.length > 0
              ? categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {category.description ?? "Explore products in this category."}
                    </CardContent>
                  </Card>
                ))
              : ["Televisions", "Kitchen appliances", "Home entertainment", "Office equipment"].map((category) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle>{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Add this category in Supabase to make it live.
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>
    </main>
  );
}
