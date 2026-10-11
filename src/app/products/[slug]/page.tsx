import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToCart } from "@/components/add-to-cart";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getProduct } from "@/lib/data/products";
import { getWhatsappNumber } from "@/lib/settings";
import { formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, whatsappNumber] = await Promise.all([getProduct(slug), getWhatsappNumber()]);

  if (!product) {
    notFound();
  }

  const image = product.images?.[0] ?? "/placeholder-product.svg";
  const specs = Object.entries(product.specs ?? {});

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <Image src={image} alt={product.name} fill priority className="object-cover" />
      </div>
      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {product.tags?.slice(0, 4).map((tag) => <Badge key={tag}>{tag}</Badge>)}
          <Badge>{product.stock_quantity > 0 ? "In stock" : "Check availability"}</Badge>
        </div>
        <div>
          <h1 className="font-display text-5xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {product.description ?? "Premium product available from IK Electronics and Gadgets."}
          </p>
        </div>
        <div className="flex items-end gap-3">
          <p className="text-4xl font-bold">{formatCurrency(product.price)}</p>
          {product.compare_at_price ? (
            <p className="pb-1 text-lg text-muted-foreground line-through">
              {formatCurrency(product.compare_at_price)}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <AddToCart
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              compareAtPrice: product.compare_at_price != null ? Number(product.compare_at_price) : null,
              image,
              stockQuantity: product.stock_quantity,
            }}
          />
          {whatsappNumber ? (
            <WhatsAppLink number={whatsappNumber} message={`Hello IK Electronics and Gadgets, I would like to enquire about: ${product.name}`}>
              Ask on WhatsApp
            </WhatsAppLink>
          ) : null}
        </div>
        {specs.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              {specs.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b pb-3 last:border-0">
                  <span className="font-medium">{key}</span>
                  <span className="text-right text-muted-foreground">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </section>
    </main>
  );
}
