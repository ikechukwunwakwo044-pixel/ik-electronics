import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getWhatsappNumber } from "@/lib/settings";

const shopLinks = [
  { href: "/products", label: "All products" },
  { href: "/#categories", label: "Shop by category" },
  { href: "/#combos", label: "Combo deals" },
];

const helpLinks = [
  { href: "/#how-to-order", label: "How to order" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/#contact", label: "Contact us" },
];

export default async function SiteFooter() {
  const whatsappNumber = await getWhatsappNumber();
  const address = process.env.NEXT_PUBLIC_STORE_ADDRESS ?? "Lagos, Nigeria";

  return (
    <footer className="mt-16 bg-secondary text-secondary-foreground">
      {whatsappNumber ? (
        <div className="border-b border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
            <div>
              <p className="font-display text-2xl font-extrabold tracking-tight">
                Seen something you like? Order it.
              </p>
              <p className="mt-1 text-sm text-white/60">
                Send us a message on WhatsApp for price, stock and delivery details.
              </p>
            </div>
            <WhatsAppLink number={whatsappNumber} message="Hello IK Electronics and Gadgets, I would like to place an order.">
              <MessageCircle data-icon="inline-start" />
              Chat on WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/ik-electronics-logo.jpeg"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-md border border-white/10 object-cover"
            />
            <span>
              <span className="block font-display text-base font-extrabold leading-none tracking-tight">
                IK Electronics
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                &amp; Gadgets
              </span>
            </span>
          </div>
          <p className="max-w-xs text-sm leading-6 text-white/60">
            Televisions, sound systems, kitchen appliances, gadgets and office equipment — genuine,
            tested and fairly priced.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/40">Shop</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/80 transition-colors hover:text-amber-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/40">Help</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            {helpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/80 transition-colors hover:text-amber-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/40">Contact</h3>
          <ul className="mt-4 flex flex-col gap-4 text-sm text-white/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden="true" />
              {address}
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden="true" />
              Mon – Sat: 8am – 7pm
            </li>
            {whatsappNumber ? (
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden="true" />
                <WhatsAppLink
                  number={whatsappNumber}
                  message="Hello IK Electronics and Gadgets, I have a question."
                >
                  Ask us on WhatsApp
                </WhatsAppLink>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-white/50 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} IK Electronics and Gadgets. All rights reserved.
        </p>
      </div>
    </footer>
  );
}