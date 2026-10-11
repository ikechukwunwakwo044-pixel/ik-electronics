"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export function CartButton() {
  const { itemCount, loaded } = useCart();

  return (
    <Button asChild variant="ghost" size="icon" className="relative" aria-label={loaded && itemCount > 0 ? `Cart (${itemCount} items)` : "Cart"}>
      <Link href="/cart">
        <ShoppingBag data-icon="inline-start" />
        {loaded && itemCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex size-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground">
            {itemCount}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}