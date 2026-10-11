import type { Metadata } from "next";
import { Archivo, Work_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800", "900"],
});

const sans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "IK Electronics and Gadgets",
    template: "%s | IK Electronics",
  },
  description:
    "Buy genuine TVs, sound systems, kitchen appliances, gadgets and office equipment from IK Electronics and Gadgets. Honest prices, delivery across Nigeria.",
  openGraph: {
    title: "IK Electronics and Gadgets",
    description:
      "Genuine electronics, home appliances and gadgets at fair prices, with delivery across Nigeria.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <CartProvider>
          <SiteHeader />
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
