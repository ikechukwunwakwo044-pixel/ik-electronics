import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0] ?? "/placeholder-product.svg";
  const stockLabel = product.stock_quantity > 0 ? "In stock" : "Check availability";

  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge>{stockLabel}</Badge>
          {product.is_featured ? <Badge>Featured</Badge> : null}
        </div>
        <div className="flex flex-col gap-2">
          <Link href={`/products/${product.slug}`} className="text-lg font-semibold hover:underline">
            {product.name}
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description ?? "Reliable product for homes, offices, and everyday use."}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold">{formatCurrency(product.price)}</p>
            {product.compare_at_price ? (
              <p className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.compare_at_price)}
              </p>
            ) : null}
          </div>
          <Button asChild variant="accent" size="sm">
            <Link href={`/products/${product.slug}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
