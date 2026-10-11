import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories, getFeaturedProducts } from "@/lib/data/products";

const confidencePoints = [
  { icon: ShieldCheck, title: "Shop with confidence", body: "Clear prices and dependable support before you order." },
  { icon: PackageCheck, title: "Curated product bundles", body: "Thoughtful combinations for your home, business, or next gift." },
  { icon: Truck, title: "Delivery updates", body: "Stay informed while we help move your order forward." },
];

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <main>
      <section className="relative overflow-hidden bg-primary">
        <div className="brand-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[74vh] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="max-w-2xl text-white">
            <Badge className="border-white/25 bg-white/10 text-white">Electronics, appliances, office essentials</Badge>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] sm:text-7xl">Upgrade every room, every day.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-blue-50 sm:text-lg">
              Shop dependable TVs, kitchen appliances, sound systems, gadgets, and practical combo deals from IK Electronics and Gadgets.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-blue-50">
                <Link href="/products">Shop products<ArrowRight data-icon="inline-end" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href="#combos">View combo deals</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/20 bg-blue-700 shadow-2xl shadow-blue-950/30">
            <Image src="/ik-electronics-logo.jpeg" alt="IK Electronics and Gadgets" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" priority />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/70 to-transparent p-6 text-white">
              <p className="text-sm font-semibold">One trusted place for your everyday technology needs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          {confidencePoints.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <Icon className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: BadgeCheck, title: "Trusted product guidance", body: "Clear product details so customers can choose confidently." },
            { icon: PackageCheck, title: "Combo offers", body: "Smart bundles that increase value and make buying easier." },
            { icon: Truck, title: "Responsive support", body: "Quick assistance for enquiries, orders, and delivery updates." },
          ].map(({ icon: Icon, title, body }) => (
            <Card key={title}><CardHeader><Icon className="size-7 text-primary" aria-hidden="true" /><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-sm leading-7 text-muted-foreground">{body}</CardContent></Card>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><h2 className="font-display text-4xl font-semibold">Featured products</h2><p className="mt-3 max-w-2xl text-muted-foreground">Fresh picks from the IK Electronics catalog.</p></div>
            <Button asChild variant="outline"><Link href="/products">Browse all products</Link></Button>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          ) : (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Featured products will appear here after they are added in Supabase.</CardContent></Card>
          )}
        </div>
      </section>

      <section id="combos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div><h2 className="font-display text-4xl font-semibold">Find the right fit, faster</h2><p className="mt-4 leading-8 text-muted-foreground">Explore focused categories and practical combo offers that make choosing the right product simple.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.length > 0 ? categories.map((category) => (
              <Card key={category.id}><CardHeader><CardTitle>{category.name}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{category.description ?? "Explore products in this category."}</CardContent></Card>
            )) : ["Televisions", "Kitchen appliances", "Home entertainment", "Office equipment"].map((category) => (
              <Card key={category}><CardHeader><CardTitle>{category}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Add this category in Supabase to make it live.</CardContent></Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
