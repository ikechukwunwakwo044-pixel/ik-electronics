"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCart, type CartLineItem } from "@/lib/cart";
import { formatCurrency } from "@/lib/utils";

type AddToCartProduct = Omit<CartLineItem, "quantity">;

export function AddToCart({
  product,
  size = "default",
}: {
  product: AddToCartProduct;
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);
  const outOfStock = product.stockQuantity <= 0;

  function handleAdd() {
    if (outOfStock) {
      return;
    }

    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button size={size} onClick={handleAdd} disabled={outOfStock} aria-live="polite" className={outOfStock ? "" : "bg-primary text-primary-foreground hover:bg-[#9a3412]"}>
      {outOfStock
        ? "Check availability"
        : added
          ? `Added · ${formatCurrency(product.price)}`
          : "Add to cart"}
    </Button>
  );
}