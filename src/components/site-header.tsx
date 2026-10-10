import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          IK Electronics
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
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingBag data-icon="inline-start" />
          </Button>
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
