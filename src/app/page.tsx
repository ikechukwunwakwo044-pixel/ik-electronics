import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CookingPot,
  Headphones,
  Laptop,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Speaker,
  Truck,
  Tv,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getCategories, getFeaturedProducts } from "@/lib/data/products";
import { getWhatsappNumber } from "@/lib/settings";

const uspItems = [
  { icon: ShieldCheck, title: "Genuine and tested", body: "Every product is verified before it is listed or sold." },
  { icon: Truck, title: "Delivery across Nigeria", body: "We arrange safe delivery and share updates on your order." },
  { icon: MessageCircle, title: "Fast on WhatsApp", body: "Ask about stock, prices and bundles — we reply quickly." },
  { icon: Banknote, title: "Flexible payment", body: "Bank transfer, pay-on-delivery, or let's talk on WhatsApp." },
];

const steps = [
  { number: "01", title: "Browse the catalogue", body: "Find TVs, sound systems, kitchen appliances, gadgets and more in one place." },
  { number: "02", title: "Add to cart or message us", body: "Build your order on the site, or send us a WhatsApp message with what you need." },
  { number: "03", title: "Confirm, then get it delivered", body: "We confirm price and stock, you pay, and we arrange delivery to your door." },
];

type CategoryTile = {
  id?: string;
  name: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
  icon: LucideIcon;
};

const fallbackCategories: CategoryTile[] = [
  { name: "Televisions", description: "LED, QLED and smart TVs in every size.", icon: Tv },
  { name: "Kitchen appliances", description: "Fridges, cookers, blenders and more.", icon: CookingPot },
  { name: "Sound and home entertainment", description: "Speakers, sound bars and home theatres.", icon: Speaker },
  { name: "Gadgets and office equipment", description: "Laptops, printers, power banks and more.", icon: Laptop },
];

const categoryIcons: LucideIcon[] = [Tv, CookingPot, Speaker, Laptop, Headphones];

const testimonials = [
  {
    quote: "TV arrived well packaged and it works perfectly. The team kept me updated until it got to my house.",
    name: "Chinedu O.",
    detail: "Bought a 55\" smart TV, delivered in Lagos",
  },
  {
    quote: "I messaged them on WhatsApp in the evening and my blender set was sorted before the weekend.",
    name: "Aisha B.",
    detail: "Ordered a kitchen bundle",
  },
  {
    quote: "First time I ordered, the sound system was exactly as described. These guys are straightforward to deal with.",
    name: "Emeka N.",
    detail: "Returning customer",
  },
];

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "It depends on your location. Within Lagos we often deliver the same or next day; other locations typically take 2–4 days. You'll get a tracker or regular updates once your order is confirmed.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer and pay-on-delivery for eligible areas. For large or bulky items, we usually confirm with you first before dispatch.",
  },
  {
    question: "Are the products genuine?",
    answer:
      "Yes. We stock and sell genuine electronics and appliances, and we test items before listing. If you ever have a concern, message us on WhatsApp and we'll sort it out.",
  },
  {
    question: "Can I get a bundle or discounted price?",
    answer:
      "Often, yes. Ask us on WhatsApp about combo deals, bundles and better prices on multiple items — especially for homes and offices.",
  },
  {
    question: "Do you offer warranty or after-sales support?",
    answer:
      "Warranty depends on the product and brand. We're honest about what each item includes, and we support you after the sale with any questions or issues.",
  },
];

export default async function HomePage() {
  const [featuredProducts, categories, whatsappNumber] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getWhatsappNumber(),
  ]);

  const heroImages = featuredProducts.flatMap((p) => p.images?.[0] ?? []).slice(0, 3);
  const heroFallback = heroImages.length > 0 ? heroImages : null;

  const categoriesToShow: CategoryTile[] =
    categories.length > 0
      ? categories.map((category, index) => ({
          ...category,
          icon: categoryIcons[index % categoryIcons.length],
        }))
      : fallbackCategories;

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#faf6ed]">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-eyebrow text-primary">IK Electronics &amp; Gadgets</p>
            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Your trusted plug for TVs, sound &amp; everyday gear.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Genuine televisions, home appliances, sound systems, gadgets and office equipment — at
              honest prices, with delivery across Nigeria.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/products">
                  Browse the catalogue
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              {whatsappNumber ? (
                <WhatsAppLink
                  number={whatsappNumber}
                  message="Hello IK Electronics and Gadgets, I would like to make an enquiry."
                >
                  <MessageCircle data-icon="inline-start" />
                  Ask on WhatsApp
                </WhatsAppLink>
              ) : (
                <Button asChild size="lg" variant="secondary">
                  <Link href="/#how-to-order">See how to order</Link>
                </Button>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" aria-hidden="true" /> Genuine stock
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="size-4 text-primary" aria-hidden="true" /> Delivery across Nigeria
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden="true" /> Lagos, Nigeria
              </span>
            </div>
          </div>

          <div className="relative" aria-hidden="true">
            {heroFallback ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border shadow-lg">
                  <Image src={heroFallback[0]} alt="" fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
                </div>
                <div className="flex flex-col gap-4 pt-10">
                  {(heroFallback[1] ?? heroFallback[0]) ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-border shadow-lg">
                      <Image
                        src={heroFallback[1] ?? heroFallback[0]}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 20vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  {(heroFallback[2] ?? heroFallback[0]) ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-border shadow-lg">
                      <Image
                        src={heroFallback[2] ?? heroFallback[0]}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 20vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="relative aspect-square overflow-hidden rounded-lg border border-border shadow-xl">
                <Image
                  src="/ik-electronics-logo.jpeg"
                  alt="IK Electronics and Gadgets"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* USP strip */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {uspItems.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-3">
              <Icon className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-eyebrow text-primary">Shop by category</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              What do you need today?
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">See everything</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesToShow.map((category, index) => {
            const Icon = categoryIcons[index % categoryIcons.length];
            return (
              <Link
                key={category.id ?? category.name}
                href={`/products?category=${encodeURIComponent(category.slug ?? category.name)}`}
                className="group relative overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f3eada]">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Icon className="size-14 text-[#c8b798]" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <h3 className="font-display text-lg font-bold leading-snug">{category.name}</h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {category.description ?? "Browse this category"}
                    </p>
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-card py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-eyebrow text-primary">Fresh from the shelves</p>
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                Featured products
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">Browse all products</Link>
            </Button>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-10 text-center text-muted-foreground">
                New products are being added. Check back soon — or ask us on WhatsApp what you&apos;re looking for.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Combo band */}
      <section id="combos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-secondary px-6 py-12 text-secondary-foreground sm:px-10">
          <div className="hero-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-eyebrow text-amber-400">Combo deals</p>
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                Bundle smarter, pay less.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-white/70">
                Pair a TV with a sound bar, or kit out your kitchen in one go. Ask us about bundles —
                they usually come with a better price.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-amber-500 text-[#1f1a12] hover:bg-amber-400">
                  <Link href="/products">Explore products</Link>
                </Button>
                {whatsappNumber ? (
                  <WhatsAppLink
                    number={whatsappNumber}
                    message="Hello IK Electronics and Gadgets, please send me your current combo deals."
                  />
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["100%", "Genuine stock"],
                ["24/7", "WhatsApp support"],
                ["NGN", "Fair pricing"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/5 px-3 py-5">
                  <p className="font-display text-2xl font-extrabold text-amber-400">{value}</p>
                  <p className="mt-1 text-xs text-white/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to order */}
      <section id="how-to-order" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-eyebrow text-primary">How it works</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Ordering is straight forward
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            No complicated checkout required. Three simple steps to get what you need.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.number} className="block-brush relative">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="font-display text-4xl font-black text-primary/30">{step.number}</span>
                <h3 className="font-display text-2xl font-bold tracking-tight">{step.title}</h3>
                <p className="leading-7 text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-eyebrow text-primary">What customers say</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            People keep coming back.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-4 p-6">
                  <p className="text-lg leading-7 text-foreground">“{item.quote}”</p>
                  <div className="mt-auto border-t pt-4">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-eyebrow text-primary">Questions</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
            Before you order
          </h2>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-lg border bg-card px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="text-primary transition-transform group-open:rotate-45">
                  <span className="text-xl leading-none font-bold">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border bg-card px-6 py-12 text-center sm:px-10">
          <div className="hero-grid absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Talk to us before you buy.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Stock changes fast. Message us on WhatsApp to confirm price and availability, or ask
              about bundles for your home or office.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {whatsappNumber ? (
                <WhatsAppLink
                  number={whatsappNumber}
                  message="Hello IK Electronics and Gadgets, I would like to make an enquiry."
                >
                  <MessageCircle data-icon="inline-start" />
                  Chat with us on WhatsApp
                </WhatsAppLink>
              ) : (
                <Button asChild size="lg">
                  <Link href="/products">Start by browsing products</Link>
                </Button>
              )}
              <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {process.env.NEXT_PUBLIC_STORE_ADDRESS ?? "Lagos, Nigeria"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}