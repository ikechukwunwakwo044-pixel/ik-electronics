import { CartView } from "@/app/cart/cart-view";
import { getWhatsappNumber } from "@/lib/settings";

export const metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const whatsappNumber = await getWhatsappNumber();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-semibold">Shopping cart</h1>
      <CartView whatsappNumber={whatsappNumber} />
    </main>
  );
}