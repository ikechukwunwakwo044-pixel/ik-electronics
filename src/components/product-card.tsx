import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCart } from "@/components/add-to-cart";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

function stockInfo(stock: number) {
  if (stock <= 0) return { label: "Check availability", tone: "bg-[#c0392b]/10 text-[#c0392b] border-transparent" };
  if (stock <= 5) return { label: `Only ${stock} left`, tone: "bg-amber-500/15 text-[#92400e] border-transparent" };
  return { label: "In stock", tone: "bg-green-600/10 text-green-700 border-transparent" };
}

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0] ?? "/placeholder-product.svg";
  const price = Number(product.price);
  const compareAt = product.compare_at_price != null ? Number(product.compare_at_price) : null;
  const stock = stockInfo(product.stock_quantity);
  const discount =
    compareAt != null && compareAt > price && price > 0
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null;

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-[#f3eada]">
        <div className="relative aspect-[4/3]">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </div>
        <Badge className={cn("absolute left-3 top-3 border", stock.tone)}>{stock.label}</Badge>
        {discount != null ? (
          <span className="absolute right-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
            -{discount}%
          </span>
        ) : null}
      </Link>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 font-display text-lg font-bold leading-snug tracking-tight hover:text-primary"
          >
            {product.name}
          </Link>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {product.description ?? "Genuine product from IK Electronics and Gadgets"}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div className="flex flex-col">
            <p className="text-xl font-extrabold tracking-tight">{formatCurrency(price)}</p>
            {compareAt != null && compareAt > price ? (
              <p className="text-xs text-muted-foreground line-through">{formatCurrency(compareAt)}</p>
            ) : null}
          </div>
          <AddToCart
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price,
              compareAtPrice: compareAt,
              image,
              stockQuantity: product.stock_quantity,
            }}
          />
        </div>

        <Button asChild variant="ghost" size="sm" className="justify-between px-2 text-primary hover:bg-muted">
          <Link href={`/products/${product.slug}`}>
            View full details
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}