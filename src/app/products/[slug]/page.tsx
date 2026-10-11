import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getProduct, getProducts } from "@/lib/data/products";
import { getWhatsappNumber } from "@/lib/settings";
import { formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, whatsappNumber, allProducts] = await Promise.all([
    getProduct(slug),
    getWhatsappNumber(),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const images = product.images?.length ? product.images : ["/placeholder-product.svg"];
  const price = Number(product.price);
  const compareAt = product.compare_at_price != null ? Number(product.compare_at_price) : null;
  const specs = Object.entries(product.specs ?? {});
  const discount =
    compareAt != null && compareAt > price && price > 0
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null;
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-[#f3eada]">
            <Image src={images[0]} alt={product.name} fill priority className="object-cover" />
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={image + index} className="relative aspect-square overflow-hidden rounded-md border bg-[#f3eada]">
                  <Image src={image} alt={`${product.name} image ${index + 1}`} fill sizes="(min-width: 1024px) 12vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Details */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {(product.tags ?? []).slice(0, 4).map((tag) => (
              <Badge key={tag} className="bg-muted text-muted-foreground hover:bg-muted">
                {tag}
              </Badge>
            ))}
            <Badge
              className={
                product.stock_quantity > 0
                  ? "border-transparent bg-green-600/10 text-green-700"
                  : "border-transparent bg-[#c0392b]/10 text-[#c0392b]"
              }
            >
              {product.stock_quantity > 0
                ? product.stock_quantity <= 5
                  ? `Only ${product.stock_quantity} left`
                  : "In stock"
                : "Check availability"}
            </Badge>
          </div>

          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {product.description ?? "Genuine product available from IK Electronics and Gadgets."}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            {price > 0 ? (
              <>
                <p className="text-4xl font-black tracking-tight">{formatCurrency(price)}</p>
                {compareAt != null && compareAt > price ? (
                  <>
                    <p className="pb-1 text-lg text-muted-foreground line-through">
                      {formatCurrency(compareAt)}
                    </p>
                    <Badge className="border-transparent bg-accent/20 text-accent-foreground">
                      Save {discount}%
                    </Badge>
                  </>
                ) : null}
              </>
            ) : (
              <p className="text-3xl font-black tracking-tight text-primary">
                Price on request
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {price > 0 ? (
              <AddToCart
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price,
                  compareAtPrice: compareAt,
                  image: images[0],
                  stockQuantity: product.stock_quantity,
                }}
              />
            ) : null}
            {whatsappNumber ? (
              <WhatsAppLink
                number={whatsappNumber}
                message={`Hello IK Electronics and Gadgets, I would like to enquire about: ${product.name}`}
              >
                <MessageCircle data-icon="inline-start" />
                Ask on WhatsApp
              </WhatsAppLink>
            ) : null}
          </div>

          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" /> Genuine and tested stock
            </li>
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-primary" aria-hidden="true" /> Delivery across Nigeria
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary" aria-hidden="true" /> Chat with us before you order
            </li>
          </ul>

          {specs.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-bold tracking-tight">Specifications</h2>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  {specs.map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 border-b border-border pb-3 sm:col-span-2">
                      <dt className="font-semibold">{key}</dt>
                      <dd className="text-right text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ) : null}
        </section>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-eyebrow text-primary">Keep browsing</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                You might also like
              </h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-primary hover:underline">
              View all products
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}