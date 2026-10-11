"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/products", label: "Shop products" },
  { href: "/#categories", label: "Categories" },
  { href: "/#combos", label: "Combo deals" },
  { href: "/#contact", label: "Contact us" },
  { href: "/login", label: "Sign in / Account" },
];

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>

      {open ? (
        <nav className="absolute inset-x-0 top-full border-b bg-background px-4 pb-4 pt-2 shadow-lg">
          <ul className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-3 transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}