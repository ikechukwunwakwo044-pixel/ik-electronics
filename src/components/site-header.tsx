import Link from "next/link";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/cart-button";
import { MobileMenu } from "@/components/mobile-menu";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="IK Electronics and Gadgets home">
          <Image
            src="/ik-electronics-logo.jpeg"
            alt=""
            width={42}
            height={42}
            className="size-10 rounded-md object-cover"
            priority
          />
          <span className="leading-tight">
            <span className="block text-base font-bold text-foreground">IK Electronics</span>
            <span className="block text-xs font-medium text-muted-foreground">& Gadgets</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/products" className="transition-colors hover:text-foreground">
            Products
          </Link>
          <Link href="/#combos" className="transition-colors hover:text-foreground">
            Combo deals
          </Link>
          <Link href="/admin" className="transition-colors hover:text-foreground">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <MobileMenu />
          <CartButton />
          <Button asChild variant={user ? "outline" : "default"} size="sm">
            <Link href={user ? "/account" : "/login"}>
              <UserRound data-icon="inline-start" />
              {user ? "Account" : "Sign in"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
