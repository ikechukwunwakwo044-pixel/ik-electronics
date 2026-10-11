"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart, type CartLineItem } from "@/lib/cart";
import { buildWhatsAppUrl } from "@/lib/settings";
import { formatCurrency } from "@/lib/utils";

function buildOrderMessage(items: CartLineItem[]) {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} - ${formatCurrency(item.price)} x ${item.quantity}`,
  );
  return [
    "Hello IK Electronics and Gadgets, I would like to order:",
    ...lines,
    `Subtotal: ${formatCurrency(items.reduce((total, item) => total + item.price * item.quantity, 0))}`,
  ].join("\n");
}

export function CartView({ whatsappNumber }: { whatsappNumber: string | null }) {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild size="lg">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const orderUrl = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, buildOrderMessage(items))
    : null;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex gap-4 p-4">
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={item.image ?? "/placeholder-product.svg"} alt={item.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Link href={`/products/${item.slug}`} className="font-semibold hover:underline">
                  {item.name}
                </Link>
                <p className="text-sm font-bold">{formatCurrency(item.price)}</p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus aria-hidden="true" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold" aria-label="Quantity">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity}
                    >
                      <Plus aria-hidden="true" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit">
        <CardContent className="flex flex-col gap-4 p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Items ({itemCount})</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-semibold">Subtotal</span>
            <span className="text-xl font-bold">{formatCurrency(subtotal)}</span>
          </div>
          {orderUrl ? (
            <Button asChild size="lg" className="w-full">
              <Link href={orderUrl} target="_blank" rel="noopener noreferrer">
                Order via WhatsApp
              </Link>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Online checkout is being set up. Please check back shortly.
            </p>
          )}
          <Button variant="ghost" onClick={clear} className="text-muted-foreground">
            Clear cart
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}