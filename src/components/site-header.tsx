import Link from "next/link";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/cart-button";
import { MobileMenu } from "@/components/mobile-menu";
import { createClient } from "@/lib/supabase/server";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/#categories", label: "Categories" },
  { href: "/#combos", label: "Combo deals" },
  { href: "/#contact", label: "Contact" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-secondary text-secondary-foreground">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-medium tracking-wide sm:text-sm">
          Genuine products &nbsp;·&nbsp; Honest prices &nbsp;·&nbsp; Delivery across Nigeria
        </p>
      </div>
      <div className="border-b bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="IK Electronics and Gadgets home">
            <Image
              src="/ik-electronics-logo.jpeg"
              alt=""
              width={44}
              height={44}
              className="size-11 rounded-md border border-border object-cover"
              priority
            />
            <span className="leading-tight">
              <span className="block font-display text-lg font-extrabold leading-none tracking-tight text-foreground">
                IK Electronics
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                &amp; Gadgets
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <MobileMenu />
            <CartButton />
            <Button asChild variant={user ? "outline" : "secondary"} size="sm" className="hidden sm:inline-flex">
              <Link href={user ? "/account" : "/login"}>
                <UserRound data-icon="inline-start" />
                {user ? "Account" : "Sign in"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}